import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
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
