# Nuxt

Optimized image component for [Nuxt](https://nuxt.com/) with [Nuxt Urami](https://runyasak.github.io/nuxt-urami/).

## Install

1. Add `nuxt-urami` dependency to your project

::: code-group

```sh [npm]
$ npm add nuxt-urami
```

```sh [pnpm]
$ pnpm add nuxt-urami
```

```sh [yarn]
$ yarn add nuxt-urami
```

```sh [bun]
$ bun add nuxt-urami
```

:::

2. Add `nuxt-urami` to the `modules` section of `nuxt.config.ts`

```js
export default defineNuxtConfig({
  modules: ["nuxt-urami"],
});
```

## Usage

```vue
<template>
  <UramiImage
    src="https://demo.rayriffy.com/tom-scott.jpg"
    width="801"
    height="801"
    alt="Tom Scott"
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

## Options

Configure Nuxt Urami with `urami` property.

::: tip
All of these options are optional.

Except `storePath` which has default value is `.nuxt-urami/images`.
:::

```ts
export default {
  urami: {
    handlerConfig: {
      avif: false,
      remoteDomains: ["demo.rayriffy.com"],
      allowedDomains: ["nuxt-urami.netlify.app"],
      ttl: 1000 * 60 * 60 * 24 * 7,
      storePath: ".nuxt-urami/images", // default value
    },
  },
};
```

Learn more about overwriting the `urami` configuration in the [Urami Config](/core/configuration) section.
