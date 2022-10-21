import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      watch: {},
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      watch: {},
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    build: {
      sourcemap: true,
    },
    plugins: [react()],
  },
})
