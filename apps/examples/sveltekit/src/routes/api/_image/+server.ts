import { createRequestHandler } from '@urami/core'

import type { RequestHandler } from '@sveltejs/kit'

const handler = createRequestHandler({
  remoteDomains: ['demo.rayriffy.com'],
  allowedDomains: ['svelte-aio.vercel.app'],
})

export const GET: RequestHandler = event => handler(event.request)
