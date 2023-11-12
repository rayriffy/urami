import { createRequestHandler } from '@urami/core'

import type { APIRoute } from 'astro'

const handler = createRequestHandler()

export const GET: APIRoute = ctx => handler(ctx.request)
