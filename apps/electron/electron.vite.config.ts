import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      target: 'node16',
      watch: {},
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      target: 'node16',
      watch: {},
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    build: {
      minify: false,
      sourcemap: true,
    },
    plugins: [react()],
  },
})
