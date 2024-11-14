import { defineConfig } from 'astro/config';
import urami from '@urami/astro';
import tailwind from '@astrojs/tailwind';

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [urami(), tailwind()],
  adapter: node({
    mode: "standalone"
  })
});