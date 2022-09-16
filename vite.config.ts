import { rmSync } from 'fs'
import Path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import pkg from './package.json'

rmSync(Path.join(__dirname, 'dist'), { recursive: true, force: true }) // v14.14.0

export default defineConfig({
  resolve: {
    alias: {
      '@': Path.join(__dirname, 'src'),
    },
  },
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
            sourcemap: false,
            outDir: 'dist/electron/main',
          },
        },
      },
      preload: {
        input: {
          index: Path.join(__dirname, 'electron/preload/index.ts'),
        },
        vite: {
          build: {
            sourcemap: 'inline',
            outDir: 'dist/electron/preload',
          },
        },
      },
      renderer: {},
    }),
  ],
})
