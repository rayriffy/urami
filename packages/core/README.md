# @urami/core

Server-side for Urami automatic image optimization. Please refer to [documentation](https://urami.dev/core/overview) for more details.

## createRequestHandler

A high-order function to ceate a request handler. Options can be specifed, please refer to [Configuration](https://urami.dev/core/configuration) page

```ts
const handler = createRequestHandler({
  // configuration
});
```

The handler itself is a function that accepts a `Request` object and returns a `Response` object.

```ts
export type RequestHandler = (request: Request) => Promise<Response>;
```
