import { requestHandler } from '$lib/api'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = requestHandler({
  remoteDomains: ['demo.rayriffy.com'],
  allowedDomains: ['svelte-aio.vercel.app'],
})
