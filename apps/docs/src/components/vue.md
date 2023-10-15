# Vue

Optimized image component for [Vue](https://vuejs.org/).

## Install

::: code-group

```sh [npm]
$ npm add @urami/vue
```

```sh [pnpm]
$ pnpm add @urami/vue
```

```sh [yarn]
$ yarn add @urami/vue
```

```sh [bun]
$ bun add @urami/vue
```

:::

## Usage

```vue
<script>
  import Image from '@urami/vue'
</script>

<template>
  <Image
    src="https://demo.rayriffy.com/tom-scott.jpg"
    width="801"
    height="801"
    alt="Tom Scott"
    class="rounded-xl shadow-md"
  />
</template>
```

## Props

| Name      | Type     | Default                                                                                            | Required | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `src`     | `string` | -                                                                                                  | ✅       | Source of the image                                                  |
| `width`   | `number` | -                                                                                                  | ✅       | Width of the image                                                   |
| `height`  | `number` | -                                                                                                  | ❌       | Height of the image (Specify this will results in less layout shift) |
| `quality` | `number` | `75`                                                                                               | ❌       | Quality of the image                                                 |
| `loader`  | `fn`     | [`defaultLoader`](https://github.com/rayriffy/urami/blob/main/packages/utils/src/defaultLoader.ts) | ❌       | Loader function, please refer to [Loader](/utilities/loader)         |
