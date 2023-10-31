import path from 'node:path'
import { URL } from 'node:url'
import isAnimated from 'is-animated'

import { AVIF, JPEG, WEBP } from './constants/mimeTypes.js'
import { animateableTypes } from './constants/animateableTypes.js'
import { defaultConfig } from './constants/defaultConfig.js'
import { vectorTypes } from './constants/vectorTypes.js'

import { detectContentType } from './functions/detectContentType.js'
import { error } from './functions/error.js'
import { getCacheKey } from './functions/getCacheKey.js'
import { getExtension } from './functions/getExtension.js'
import { getHash } from './functions/getHash.js'
import { getMaxAge } from './functions/getMaxAge.js'
import { getSupportedMimeType } from './functions/getSupportedMimeType.js'
import { optimizeImage } from './functions/optimizeImage.js'
import { readImageFileSystem } from './functions/readImageFileSystem.js'
import { sendResponse } from './functions/sendResponse.js'
import { writeImageToFileSystem } from './functions/writeImageToFileSystem.js'

import type { Config } from './@types/Config.js'
import type { ResponsePayload } from './@types/ResponsePayload.js'
import type { RequestHandler } from './@types/RequestHandler.js'

export const createRequestHandler =
  (config: Partial<Config> = {}): RequestHandler =>
  async request => {
    // build general config
    const mergedConfig = {
      ...defaultConfig,
      ...config,
    }
    const targetCacheDirectory = path.join(
      process.cwd(),
      mergedConfig.storePath
    )

    // get variables
    const fullRequestUrl = new URL(request.url)
    let url = fullRequestUrl.searchParams.get('url') ?? ''
    const width = Number(fullRequestUrl.searchParams.get('w') ?? '')
    const quality = Number(fullRequestUrl.searchParams.get('q') ?? '')

    // Check if the URL is valid. If not, try to construct a new URL using defaultDomain or referer header.
    try {
      // attempt to construct a URL, a relative URL will throw an error
      url = new URL(url).toString()
    } catch (e) {
      // if default domain is specified, construct a new URL using the default domain
      const targetDomain =
        mergedConfig.defaultDomain ?? request.headers.get('referer')

      if (targetDomain === null) throw error(400, 'missing url')

      url = new URL(url, mergedConfig.defaultDomain).toString()
    }

    // make sure that this url is allowed to optimize
    if (
      mergedConfig.remoteDomains !== undefined &&
      !mergedConfig.remoteDomains.includes(new URL(url).hostname)
    ) {
      throw error(403, 'not allowed to optimize')
    }

    // make sure that referer is valid
    if (
      // only active when config exists, and running in production mode
      process.env.NODE_ENV === 'production' &&
      mergedConfig.allowedDomains !== undefined &&
      !mergedConfig.allowedDomains.includes(
        new URL(request.headers.get('referer') ?? 'http://localhost').hostname
      )
    ) {
      throw error(403, 'not allowed to access')
    }

    // get target file type to optimize
    const mimeType = getSupportedMimeType(
      /**
       * UNSTABLE
       * at the time of writing, AVIF is very CPU and memory intensive tasks. not recommended for production
       */
      ['image/webp', ...(mergedConfig.avif ? ['image/avif'] : [])],
      request.headers.get('accept') ?? ''
    )

    try {
      // find local cache if exists
      const cacheKey = getCacheKey(url, width, quality, mimeType)

      const cacheResponse = await readImageFileSystem(
        cacheKey,
        targetCacheDirectory
      )

      if (cacheResponse !== null) {
        return sendResponse(cacheResponse, 'HIT')
      }

      // get image
      const fetchedImage = await fetch(url)
      const upstreamBuffer = Buffer.from(await fetchedImage.arrayBuffer())
      const upstreamType =
        detectContentType(upstreamBuffer) ||
        (fetchedImage.headers.get('Content-Type') ?? '')
      const maxAge = getMaxAge(fetchedImage.headers.get('Cache-Control'))

      // if image is animated or vector then send original image
      // TODO: Optimization for animated images, and vector
      const vector = vectorTypes.includes(upstreamType)
      const animated =
        animateableTypes.includes(upstreamType) && isAnimated(upstreamBuffer)
      if (vector || animated) {
        return sendResponse(
          {
            buffer: upstreamBuffer,
            contentType: upstreamType,
            maxAge: 0,
            etag: getHash([upstreamBuffer]),
          },
          'MISS',
          {
            'X-Urami-Optimization': 'animate-ignore',
          }
        )
      }

      // get content type
      let contentType: string
      if (mimeType) {
        contentType = mimeType
      } else if (
        upstreamType?.startsWith('image/') &&
        getExtension(upstreamType) &&
        upstreamType !== WEBP &&
        upstreamType !== AVIF
      ) {
        contentType = upstreamType
      } else {
        contentType = JPEG
      }

      // optimize image
      let optimizedBuffer = await optimizeImage(
        upstreamBuffer,
        contentType,
        quality,
        width
      )

      if (optimizedBuffer !== null) {
        const payload: ResponsePayload = {
          buffer: optimizedBuffer,
          contentType,
          maxAge: Math.max(maxAge, mergedConfig.ttl),
          etag: getHash([optimizedBuffer]),
        }

        // write file to local storage, not await since this is not prioritised
        writeImageToFileSystem(
          cacheKey,
          contentType,
          payload.maxAge,
          payload.etag,
          payload.buffer,
          targetCacheDirectory
        )

        // response
        return sendResponse(payload, 'MISS')
      } else {
        throw error(500, 'unable to optimize image')
      }
    } catch (e) {
      throw error(500, 'unable to optimize image')
    }
  }
