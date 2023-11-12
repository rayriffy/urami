# Astro

[Example](https://github.com/rayriffy/urami/tree/main/apps/examples/astro)

Here're the steps to integrate Urami with Astro.

## Quick install

Use `astro add` to install `@urami/astro` package. This will automatically install dependencies, and add integration to `astro.config.mjs`.

::: code-group

```sh [npm]
$ npx astro add @urami/astro
```

```sh [pnpm]
$ pnpm astro add @urami/astro
```

```sh [yarn]
$ yarn astro add @urami/astro
```

:::

## Manual install

First, install `@urami/astro` package.

::: code-group

```sh [npm]
$ npm add @urami/astro
```

```sh [pnpm]
$ pnpm add @urami/astro
```

```sh [yarn]
$ yarn add @urami/astro
```

:::

Then, apply integration to `astro.config.mjs`. It's important to have `output: 'server'` in order to use Urami.

```js [astro.config.mjs]
import { defineConfig } from 'astro/config'

import urami from '@urami/astro' // [!code ++]

// https://astro.build/config
export default defineConfig({
  output: 'server', // [!code ++]
  integrations: [
    urami(), // [!code ++]
  ],
})

```

## Image component

Import `Image` component from `@urami/astro` and use it like `next/image`.

```astro
---
import Image from '@urami/astro/image'
---

<Image
  src="https://demo.rayriffy.com/tom-scott.jpg"
  width={801}
  height={801}
  alt="Tom Scott"
  class="rounded-xl shadow-md"
/>
```
