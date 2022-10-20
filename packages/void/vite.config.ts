import Path from 'path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: Path.resolve(__dirname, './src/index.ts'),
      name: 'Void',
      fileName: 'void',
      formats: ['cjs', 'es'],
    },
  },
  plugins: [
    dts({
      skipDiagnostics: false,
      logDiagnostics: true,
    }),
  ],
})
