# Solid

Optimized image component for [Solid](https://www.solidjs.com/).

## Install

::: code-group

```sh [npm]
$ npm add @urami/solid
```

```sh [pnpm]
$ pnpm add @urami/solid
```

```sh [yarn]
$ yarn add @urami/solid
```

```sh [bun]
$ bun add @urami/solid
```

:::

## Usage

```tsx
import Image from '@urami/solid'

const Component = () => {
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

## Props

| Name      | Type     | Default                                                                                            | Required | Description                                                          |
| --------- | -------- | -------------------------------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| `src`     | `string` | -                                                                                                  | ✅       | Source of the image                                                  |
| `width`   | `number` | -                                                                                                  | ✅       | Width of the image                                                   |
| `height`  | `number` | -                                                                                                  | ❌       | Height of the image (Specify this will results in less layout shift) |
| `quality` | `number` | `75`                                                                                               | ❌       | Quality of the image                                                 |
| `loader`  | `fn`     | [`defaultLoader`](https://github.com/rayriffy/urami/blob/main/packages/utils/src/defaultLoader.ts) | ❌       | Loader function, please refer to [Loader](/utilities/loader)         |
