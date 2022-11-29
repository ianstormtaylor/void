import { Draft } from 'immer'

/** A simplified `Producer` type for Immer. */
export type Producer<T> = (draft: Draft<T>) => void

/** An Immer change function. */
export type Changer<T> = (recipe: Producer<T>) => void

export function hashSeed(seed: number): string {
  return `0x${[
    hashInt(seed),
    hashInt(seed + 1),
    hashInt(seed + 2),
    hashInt(seed + 3),
  ]
    .map((n) => n.toString(16).padStart(8, '0'))
    .join('')}`
}

export function unhashSeed(hash: string): number {
  return unhashInt(Number(hash.slice(0, 10)))
}

/** Hash an integer `x` into another integer, from `1` to `2^32`. */
export function hashInt(x: number): number {
  // https://github.com/skeeto/hash-prospector
  x = (x ^ (x >>> 16)) >>> 0
  x = Math.imul(x, 569420461)
  x = (x ^ (x >>> 15)) >>> 0
  x = Math.imul(x, 1935289751)
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

/** Un-hash an integer `x` back into another integer, from `1` to `2^32`. */
export function unhashInt(x: number): number {
  // https://github.com/skeeto/hash-prospector
  x = (x ^ (x >>> 15) ^ (x >>> 30)) >>> 0
  x = Math.imul(x, 2534613543)
  x = (x ^ (x >>> 15) ^ (x >>> 30)) >>> 0
  x = Math.imul(x, 859588901)
  x = (x ^ (x >>> 16)) >>> 0
  return x
}
