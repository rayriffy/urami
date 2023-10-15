---
title: Core Overview
---

# Overview

`@urami/core` contains API handler for image optimization on server endpoints.

It's designed to be used with any frameworks that able to pass input as a [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) interface of Fetch API, and return output as [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response) interface of Fetch API.

```ts
export type RequestHandler = (request: Request) => Promise<Response>
```

## Lifecycle

1. API will get `url`, `width`, and `quality` from URL query string
2. Check if image is allowed to be optimized via [`remoteDomains`](/core/configuration#remotedomains) option
3. If you're running as a production server, API will check if request is coming from allowed domain via [`allowedDomains`](/core/configuration#alloweddomains) option
4. API will try to figure out which is the best image format to be served to user
5. If image is cached and not expired, API will serve cached image
6. Otherwise, API will download image from `url` and optimize it
7. Optimized image will be cached, and served to user