import { vitePreprocess } from '@sveltejs/kit/vite'

import autoAdapter from '@sveltejs/adapter-auto'
import bunAdapter from 'svelte-adapter-bun'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: (process.env.BUN = 'true' ? bunAdapter() : autoAdapter()),
  },
}

export default config
