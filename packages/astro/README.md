# @urami/astro

Automatic image optimization for [Astro](https://astro.build/). Please refer to [documentation](http://urami.dev/guide/astro) for more details.

## Quick install

```
# Using NPM
npx astro add @urami/astro

# Using Yarn
pnpm astro add @urami/astro

# Using PNPM
yarn astro add @urami/astro
```

Please consult documentation for manual installation.

## Component usage

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

## Props

| Name      | Type     | Default | Required | Description                                                          |
| --------- | -------- | ------- | -------- | -------------------------------------------------------------------- |
| `src`     | `string` | -       | ✅       | Source of the image                                                  |
| `width`   | `number` | -       | ✅       | Width of the image                                                   |
| `height`  | `number` | -       | ❌       | Height of the image (Specify this will results in less layout shift) |
| `quality` | `number` | `75`    | ❌       | Quality of the image                                                 |
