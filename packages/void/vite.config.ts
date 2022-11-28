import Path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    minify: false,
    sourcemap: true,
    lib: {
      entry: Path.resolve(__dirname, './src/index.ts'),
      name: 'Void',
      fileName: 'void',
      formats: ['cjs', 'es'],
    },
  },
})
