# @urami/react

Optimized image component for [React](https://react.dev/).

[Documentation](https://urami.dev/components/react)

## Usage

```tsx
import Image from "@urami/react";

const Component = () => {
  return (
    <Image
      src="https://demo.rayriffy.com/tom-scott.jpg"
      width={801}
      height={801}
      alt="Tom Scott"
      className="rounded-xl shadow-md"
    />
  );
};
```

## Props

| Name      | Type     | Default                                                                                            | Required | Description                                                                   |
| --------- | -------- | -------------------------------------------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| `src`     | `string` | -                                                                                                  | ✅       | Source of the image                                                           |
| `width`   | `number` | -                                                                                                  | ✅       | Width of the image                                                            |
| `height`  | `number` | -                                                                                                  | ❌       | Height of the image (Specify this will results in less layout shift)          |
| `quality` | `number` | `75`                                                                                               | ❌       | Quality of the image                                                          |
| `loader`  | `fn`     | [`defaultLoader`](https://github.com/rayriffy/urami/blob/main/packages/utils/src/defaultLoader.ts) | ❌       | Loader function, please refer to [Loader](https://urami.dev/utilities/loader) |
