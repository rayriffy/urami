# svelte-aio

[![NPM](https://img.shields.io/npm/v/svelte-aio)](https://www.npmjs.com/package/svelte-aio)

Automatic image optimization for SvelteKit, inspired by NextJS

> This library are still under construction, many bugs and missing features. Feel free to contribute and making bugs report.

> Do not use this library with dynamic image yet due to improper Cache-Control configuration. This will be fixed soon

## Table of contents

1. [Usage](#usage)
2. [Configuration](#configuration)

## Usage

Check out full sample at [`src/routes`](./src/routes)

Install dependencies

```
pnpm add svelte-aio
```

In `routes/api/_images`, create `+server.ts` endpoint

```ts
import { requestHandler } from 'svelte-aio/api'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = requestHandler()
```

Then use normally (almost) like `next/image`

```svelte
<!-- +page.ts -->
<script lang="ts">
  import Image from 'svelte-aio'
</script>

<Image
  src="https://demo.rayriffy.com/tom-scott.jpg"
  width={801}
  height={801}
  alt="Tom Scott"
  class="rounded-xl shadow-md"
/>
```

## Configuration

Server configrations can be specified via option params. **All parameters are optional!**

```ts
export const GET: RequestHandler = requestHandler({
  avif: false,
  remoteDomains: ['demo.rayriffy.com'],
  allowedDomains: ['svelte-aio.vercel.app'],
  ttl: 1000 * 60 * 60 * 24 * 7,
  storePath: '.svelte-kit/images',
})
```

### avif

`boolean`

Enable AVIF image format. Defaults to `false`

> **Warning:** optimizing image into AVIF format currently not reccomended due to high CPU and memory usage. Overall performance is not great when comparing to WebP.

### remoteDomains

`string[] | undefined`

List of domains that API will be allowed to optimize. Defaults to *unset*

From example above, `remoteDomains: ['demo.rayriffy.com'],` means that API will only be allowed to optimize images that served from `demo.rayriffy.com`.

Unset this option will tell API to optimize **ALL IMAGES** from **EVERYWHERE**

### allowedDomains

`string[] | undefined`

List of domains that allowed to use the API, this will be checked via header `Referer`

Only affects on `NODE_ENV=production`. Unset this option will allow anywhere to request image from this API.

### ttl

`number`

Time until images will become invalidated, defaults to **7 days**

Values are in **milliseconds**

### storePath

`string`

Directory path to cache optimized images. Defaults to `.svelte-kit/images`

Provided paths will be relative to `process.cwd()`
