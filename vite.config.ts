import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/cron-picker/',
  build: {
    lib: {
      entry: 'src/cron-picker.ts',
      formats: ['es'],
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
})
