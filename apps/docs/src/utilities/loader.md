# Loader

By default you don't have to specify the loader function as it will use the default loader function which is [`defaultLoader`](https://github.com/rayriffy/urami/blob/main/packages/utils/src/defaultLoader.ts) from `@urami/utils`.

However, there're many cases that you want to use your own loader function. For an example,

- You want to point to other server endpoints other than `/api/_images`
- You want to use your own image optimization service

```ts
export type Loader = (src: string, width: number, quality: number) => string;
```

The function accepts 3 parameters

1. `src` - Original source of the image
2. `width` - Width of the image
3. `quality` - Quality of the image

As a result, the function should return the optimized image source.

## Example

Define your own loader function

```ts
import type { Loader } from "@urami/types";

export const customLoader: Loader = (src, width, quality) => {
  const params = new URLSearchParams({
    url: src,
    w: width.toString(),
    q: quality.toString(),
  }).toString();

  if (src.startsWith("https://demo.rayriffy.com"))
    return `https://api.example.com/image?${params}`;
  else return `https://remote.foo.bar/image?${params}`;
};
```

Then pass it to the component

```tsx
<Image
  src="https://demo.rayriffy.com/tom-scott.jpg"
  width={801}
  loader={customLoader}
/>
```
