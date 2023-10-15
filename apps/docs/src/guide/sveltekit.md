# SvelteKit

[Example](https://github.com/rayriffy/urami/tree/main/apps/examples/sveltekit)

Here're the steps to integrate Urami with SvelteKit.

## Install

There're 2 packages need to be installed in order to use Urami with SvelteKit. `@urami/core` for server endpoints, and `@urami/svelte` for client-side components.

Additionally, you need to install `sharp` as well. This is because `@urami/core` uses `sharp` to optimize images, and it's a peer dependency so it won't installed by default.

::: code-group

```sh [npm]
$ npm add @urami/core @urami/svelte sharp
```

```sh [pnpm]
$ pnpm add @urami/core @urami/svelte sharp
```

```sh [yarn]
$ yarn add @urami/core @urami/svelte sharp
```

```sh [bun]
$ bun add @urami/core @urami/svelte sharp
```

:::

## Server endpoints

Create a file `routes/api/_image/+server.ts`, which is a server endpoint for Urami. This endpoint will be used to serve optimized images.

::: code-group

```js [+server.js]
import { createRequestHandler } from '@urami/core'

const handler = createRequestHandler({
  remoteDomains: ['demo.rayriffy.com'],
})

export const GET = event => handler(event.request)
```

```ts [+server.ts]
import { createRequestHandler } from '@urami/core'

import type { RequestHandler } from '@sveltejs/kit'

const handler = createRequestHandler({
  remoteDomains: ['demo.rayriffy.com'],
})

export const GET: RequestHandler = event => handler(event.request)
```

:::

For server configuration, please refer to [Configuration](/core/configuration).

## Client-side component

Import `Image` component from `@urami/svelte` and use it like `next/image`.

```svelte
<!-- +page.ts -->
<script>
  import Image from '@urami/svelte'
</script>

<Image
  src="https://demo.rayriffy.com/tom-scott.jpg"
  width={801}
  height={801}
  alt="Tom Scott"
  class="rounded-xl shadow-md"
/>
```

For client-side configuration, please refer to [Svelte](/components/svelte).
