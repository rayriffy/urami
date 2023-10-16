/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
  },
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'Image',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue', '@urami/utils'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
