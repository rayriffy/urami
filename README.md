# svelte-aio

Automatic image optimization for SvelteKit, inspired by NextJS

## Table of contents

1. [Usage](#usage)
2. [Configuration](#configuration)

## Usage

Check out full sample at [`src/routes`](./src/routes)

In `routes/api/_images`, create `+server.ts` endpoint

```ts
import { requestHandler } from 'svelte-aio/api'

import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = requestHandler()
```

Then use normally (almost) like `next/image`

```svelte
<!-- +page.ts -->
<Image
  src="https://demo.rayriffy.com/tom-scott.jpg"
  width={801}
  height={801}
  alt="Tom Scott"
  class="rounded-xl shadow-md"
/>
```

## Configuration
