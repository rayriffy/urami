export type RequestHandler = (
  request: Pick<Request, "url" | "headers">,
) => Promise<Response>;
