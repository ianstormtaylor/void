import { defineConfig } from 'rollup'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
  input: './src/index.ts',
  plugins: [commonjs(), typescript()],
  output: [
    {
      file: './dist/index.mjs',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: './dist/index.cjs',
      format: 'umd',
      name: 'Superstruct',
      sourcemap: true,
    },
  ],
})
