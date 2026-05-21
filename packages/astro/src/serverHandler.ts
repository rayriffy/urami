import { createRequestHandler } from "@urami/core";
// @ts-expect-error virtual module
import config from "virtual:@urami/astro/config";

import type { APIRoute } from "astro";

const handler = createRequestHandler(config);

export const GET: APIRoute = (ctx) => handler(ctx.request);
