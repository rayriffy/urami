import path from 'path'
import { URL } from 'url'
import isAnimated from 'is-animated'
import { error } from '@sveltejs/kit'

import { defaultConfig } from './constants/defaultConfig'
import { AVIF, JPEG, WEBP } from './constants/mimeTypes'

import { detectContentType } from './functions/detectContentType'
import { getCacheKey } from './functions/getCacheKey'
import { getExtension } from './functions/getExtension'
import { getHash } from './functions/getHash'
import { getMaxAge } from './functions/getMaxAge'
import { getSupportedMimeType } from './functions/getSupportedMimeType'
import { optimizeImage } from './functions/optimizeImage'
import { readImageFileSystem } from './functions/readImageFileSystem'
import { sendResponse } from './functions/sendResponse'
import { writeImageToFileSystem } from './functions/writeImageToFileSystem'

import type { RequestHandler } from '@sveltejs/kit'
import type { Config } from '$lib/@types/Config'
import type { ResponsePayload } from '$lib/@types/ResponsePayload'
import { vectorTypes } from './constants/vectorTypes'
import { animateableTypes } from './constants/animateableTypes'

export const requestHandler =
  (config: Partial<Config> = {}): RequestHandler =>
  async event => {
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
    const url = event.url.searchParams.get('url') ?? ''
    const width = Number(event.url.searchParams.get('w') ?? '')
    const quality = Number(event.url.searchParams.get('q') ?? '')

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
        new URL(event.request.headers.get('referer') ?? 'http://localhost')
          .hostname
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
      event.request.headers.get('accept') ?? ''
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
      const animated = animateableTypes.includes(upstreamType) && isAnimated(upstreamBuffer)
      if (vector || animated) {
        return sendResponse({
          buffer: upstreamBuffer,
          contentType: upstreamType,
          maxAge: 0,
          etag: getHash([upstreamBuffer])
        }, 'MISS', {
          'X-SvelteAIO-Optimization': 'animate-ignore'
        })
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
        // return sendResponse({
        //   buffer: upstreamBuffer,
        //   contentType,
        //   maxAge: 0,
        //   etag: getHash([upstreamBuffer])
        // }, 'MISS', {
        //   'X-SvelteAIO-Optimization': 'failure'
        // })
      }
    } catch (e) {
      throw error(500, 'unable to optimize image')
    }
  }
