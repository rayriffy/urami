# Solid Start

[Example](https://github.com/rayriffy/urami/tree/main/apps/examples/solid-start)

Here're the steps to integrate Urami with Solid Start.

## Install

There're 2 packages need to be installed in order to use Urami with SvelteKit. `@urami/core` for server endpoints, and `@urami/solid` for client-side components.

Additionally, you need to install `sharp` as well. This is because `@urami/core` uses `sharp` to optimize images, and it's a peer dependency so it won't installed by default.

::: code-group

```sh [npm]
$ npm add @urami/core @urami/solid sharp
```

```sh [pnpm]
$ pnpm add @urami/core @urami/solid sharp
```

```sh [yarn]
$ yarn add @urami/core @urami/solid sharp
```

```sh [bun]
$ bun add @urami/core @urami/solid sharp
```

:::

## Server endpoints

At directory `src/routes/api/_image.ts`, which is a server endpoint for Urami. This endpoint will be used to serve optimized images.

::: code-group

```js [_image.js]
import { createRequestHandler } from '@urami/core'

const handler = createRequestHandler({
  remoteDomains: ['demo.rayriffy.com'],
})

export const GET = ({ request }) => handler(request)
```

```ts [_image.ts]
import { createRequestHandler } from '@urami/core'

import type { APIEvent } from 'solid-start/api'

const handler = createRequestHandler({
  remoteDomains: ['demo.rayriffy.com'],
})

export const GET = ({ request }: APIEvent) => handler(request)
```

:::

For server configuration, please refer to [Configuration](/core/configuration).

## Client-side component

Import `Image` component from `@urami/solid` and use it like `next/image`.

```tsx [index.tsx]
// index.jsx
import Image from '@urami/solid'

export default function Page() {
  return (
    <Image
      src="https://demo.rayriffy.com/tom-scott.jpg"
      width={801}
      height={801}
      alt="Tom Scott"
      class="rounded-xl shadow-md"
    />
  )
}
```

For client-side configuration, please refer to [Solid](/components/solid).
