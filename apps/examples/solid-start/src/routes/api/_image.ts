import { createRequestHandler } from "@urami/core";

import type { APIEvent } from "solid-start/api";

const handler = createRequestHandler({
  remoteDomains: ["demo.rayriffy.com"],
});

export const GET = ({ request }: APIEvent) => handler(request);
