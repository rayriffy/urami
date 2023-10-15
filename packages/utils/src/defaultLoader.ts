import type { Loader } from '@urami/types'

export const defaultLoader: Loader = (src, width, quality) =>
  `/api/_image?${new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  }).toString()}`
