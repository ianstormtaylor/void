import Path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'

export default defineConfig({
  server: {
    host: process.env.VITE_DEV_SERVER_HOST,
    port: Number(process.env.VITE_DEV_SERVER_PORT),
  },
  plugins: [
    react(),
    electron({
      main: {
        entry: './main/index.ts',
        vite: {
          build: {
            outDir: './dist/main',
            emptyOutDir: true,
            sourcemap: false,
          },
        },
      },
      preload: {
        input: {
          index: Path.join(__dirname, './preload/index.ts'),
        },
        vite: {
          build: {
            outDir: './dist/preload',
            emptyOutDir: true,
            sourcemap: 'inline',
          },
        },
      },
      renderer: {},
    }),
  ],
})
