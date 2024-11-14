---
title: Core Configuration
---

# Configuration

Server configrations can be specified via `option` parameters.

::: tip
All parameters are optional!
:::

```js
import { createRequestHandler } from "@urami/core";

const handler = createRequestHandler({
  avif: false,
  remoteDomains: ["demo.rayriffy.com"],
  allowedDomains: ["svelte-aio.vercel.app"],
  ttl: 1000 * 60 * 60 * 24 * 7,
  storePath: ".svelte-kit/images",
});
```

## avif

`boolean`

Enable AVIF image format. Defaults to `false`

::: warning
Optimizing image into AVIF format currently not reccomended due to high CPU and memory usage. Overall performance is not great when comparing to WebP.
:::

## remoteDomains

`string[] | undefined`

List of domains that API will be allowed to optimize. Defaults to _unset_

From example above, `remoteDomains: ['demo.rayriffy.com']` means that API will only be allowed to optimize images that served from `demo.rayriffy.com`.

Unset this option will tell API to optimize **all images** from **everywhere**

## allowedDomains

`string[] | undefined`

List of domains that allowed to use the API, this will be checked via header `Referer`

Only applied when `process.env.NODE_ENV` is set to `production`. Unset this option will allow anywhere to request image from this API.

## defaultDomain

`string | undefined`

Default domain to use when domain is not specified in URL. Defaults to undefined

## ttl

`number`

Time until images will become invalidated, defaults to **7 days**

Values are in **milliseconds**

## storePath

`string`

Directory path to cache optimized images. Defaults to `.svelte-kit/images`

Provided paths will be relative to `process.cwd()`
