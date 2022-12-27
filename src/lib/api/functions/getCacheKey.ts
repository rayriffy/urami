import { getHash } from './getHash'
import { cacheVersion } from '../constants/cacheVersion'

export const getCacheKey = (
  href: string,
  width: number,
  quality: number,
  mimeType: string
) => {
  return getHash([cacheVersion, href, width, quality, mimeType])
}
