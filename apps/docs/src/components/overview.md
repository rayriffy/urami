---
title: Components Overview
---

# Overview

Tecnically, you don't really need to use any of the components provided by **Urami**. You can build your own components to render optimized images on the client. But we do provide some components to help you get started.

- [React](/components/react)
- [Solid](/components/solid)
- [Svelte](/components/svelte)
- [Vue](/components/vue)

The component itself will generate a `<picture>` element with `<source>` and `<img>` tags inside. The `<source>` tags will be generated based on the `srcset` and `sizes` attributes of the image. The `<img>` tag will be generated based on the `src` attribute of the image.

The optimized source of an image will be followed by following format

```
/api/_image?url=<original_src>&w=<width>&q=<quality>
```

For example, if you have an image with the following source

`https://demo.rayriffy.com/tom-scott.jpg`

And you want to render it with a width of `500px` and a quality of `75%`, the optimized source will be

`/api/_image?url=https://demo.rayriffy.com/tom-scott.jpg&w=500&q=75`

If you want to change endpoint of the URL to be other than `/api/_image`, please refer to [Loader]('/utilities/loader')
