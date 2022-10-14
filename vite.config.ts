import Path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

export default defineConfig({
  server: {
    host: pkg.env.VITE_DEV_SERVER_HOST,
    port: pkg.env.VITE_DEV_SERVER_PORT,
  },

  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main/index.ts',
        vite: {
          build: {
            outDir: 'dist/electron/main',
            emptyOutDir: true,
            sourcemap: false,
          },
        },
      },
      preload: {
        input: {
          index: Path.join(__dirname, 'electron/renderer/preload.ts'),
        },
        vite: {
          build: {
            outDir: 'dist/electron/preload',
            emptyOutDir: true,
            sourcemap: 'inline',
          },
        },
      },
      renderer: {},
    }),
  ],
})
