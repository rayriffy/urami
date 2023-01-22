import type { ResponsePayload } from '$lib/@types/ResponsePayload'

export const sendResponse = (
  payload: ResponsePayload,
  cacheHit: 'HIT' | 'MISS',
  extraHeaders: Record<string, string> = {}
) =>
  new Response(payload.buffer, {
    headers: {
      Vary: 'Accept',
      'Content-Type': payload.contentType ?? '',
      'Cache-Control': `public, max-age=${Math.floor(payload.maxAge / 1000)}, must-revalidate`,
      'CDN-Cache-Control': `max-age=${Math.floor(payload.maxAge / 1000)}`,
      'Content-Length': Buffer.byteLength(payload.buffer).toString(),
      'Content-Security-Policy':
        "script-src 'none'; frame-src 'none'; sandbox;",
      'Strict-Transport-Security':
        'max-age=31536000; includeSubDomains; preload',
      ETag: payload.etag,
      'X-SvelteAIO-Cache': cacheHit,
      ...extraHeaders,
    },
  })
