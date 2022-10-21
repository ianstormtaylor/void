import Path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig({
  server: {
    host: process.env.VITE_DEV_SERVER_HOST,
    port: Number(process.env.VITE_DEV_SERVER_PORT),
  },
  build: {
    minify: false,
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: './main/index.ts',
        vite: {
          build: {
            outDir: './dist/main',
            minify: false,
            emptyOutDir: true,
            sourcemap: false,
          },
        },
      },
      preload: {
        input: {
          index: Path.resolve(__dirname, './preload/index.ts'),
        },
        vite: {
          build: {
            outDir: './dist/preload',
            minify: false,
            emptyOutDir: true,
            sourcemap: 'inline',
          },
        },
      },
    }),
  ],
})
