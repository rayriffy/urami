import { getHash } from './getHash.js'
import { cacheVersion } from '../constants/cacheVersion.js'

export const getCacheKey = (
  href: string,
  width: number,
  quality: number,
  mimeType: string
) => {
  return getHash([cacheVersion, href, width, quality, mimeType])
}
