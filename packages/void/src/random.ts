import { Math, Narrowable } from '.'
import { createNoise4D } from 'simplex-noise'
import { createPrng } from './utils'

/** The current 4D noise generator, implicitly created. */
let NOISE: null | ((x: number, y: number, z: number, w: number) => number) =
  null

/** Generate a binomially-distributed number with `n` tries and `p` probability. */
export function binomial(n = 1, p = 0.5) {
  let x = 0
  for (let i = 0; i < n; i++) x += random() < p ? 1 : 0
  return x
}

/** Generate a boolean, with optional probability `p` of being `true`. */
export function bool(p = 0.5): boolean {
  return random() < p
}

/** Generate either `0` or `1`, with optional probability `p` of success. */
export function coin(p = 0.5): 0 | 1 {
  return random() < p ? 1 : 0
}

/** Generate an exponentially-distributed number with `lambda`. */
export function exponential(lambda = 1) {
  // https://github.com/transitive-bullshit/random/blob/master/src/distributions/exponential.ts
  return Math.log(1 - random()) / -lambda
}

/** Generate a normally-distributed number with `mean` and `variance`. */
export function gaussian(mean = 0, variance = 1): number {
  // https://stackoverflow.com/a/36481059/154765
  let a = random()
  let b = random()
  let r = Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b)
  return r * Math.sqrt(variance) + mean
}

/** Generate a geometrically-distributed number with probability `p`. */
export function geometric(p = 0.5) {
  // https://github.com/transitive-bullshit/random/blob/master/src/distributions/geometric.ts
  return (1 + Math.log(random()) * (1 / Math.log(1 - p))) | 0
}

/** Generate a floating point number, with optional `min`, `max`, and `step`. */
export function float(min?: number, max?: number, step?: number): number {
  if (min == null) (min = 0), (max = 1)
  if (max == null) (max = min), (min = 0)
  let range = max - min
  if (step != null) range += step
  let r = random() * range
  if (step != null) r = Math.floor(r, { multiple: step })
  return min + r
}

/** Run a `fn` with a fork of the current PRNG, only consuming one random value. */
export function fork(fn: () => void): void {
  let s = int(0, 2 ** 32)
  let prng = createPrng(s)
  seed(prng, fn)
}

/** Generate an integer, with optional `min`, `max`, and `step`. */
export function int(min?: number, max?: number, step = 1): number {
  if (min == null) (min = 0), (max = 1)
  if (max == null) (max = min), (min = 0)
  return float(min, max, step)
}

/** Options for the `noise` method. */
export type NoiseOptions = {
  amplitude?: number
  frequency?: number
  lacunarity?: number
  octaves?: number
  persistence?: number
}

/** Generate simplex noise from `x`, `y`, `z`, and `w` coordinates, with `options`. */
export function noise(x: number, options?: NoiseOptions): number
export function noise(x: number, y: number, options?: NoiseOptions): number
export function noise(
  x: number,
  y: number,
  z: number,
  options?: NoiseOptions
): number
export function noise(
  x: number,
  y: number,
  z: number,
  w: number,
  options?: NoiseOptions
): number
export function noise(
  x: number,
  y?: number | NoiseOptions,
  z?: number | NoiseOptions,
  w?: number | NoiseOptions,
  options?: NoiseOptions
): number {
  if (typeof y === 'object') (options = y), (y = 0)
  if (typeof z === 'object') (options = z), (z = 0)
  if (typeof w === 'object') (options = w), (w = 0)
  y ??= 0
  z ??= 0
  w ??= 0
  options ??= {}
  let noise = (NOISE ??= createNoise4D(random))
  let {
    amplitude = 1.0,
    frequency = 1,
    lacunarity = 2,
    octaves = 4,
    persistence = 0.5,
  } = options
  let sum = 0
  let max = 0

  // https://catlikecoding.com/unity/tutorials/pseudorandom-noise/noise-variants/
  for (let o = 0; o < octaves; o++) {
    let n = noise(x * frequency, y * frequency, z * frequency, w * frequency)
    sum += n * amplitude
    max += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  sum /= 2 - 1 / 2 ** (octaves - 1)
  return sum / max
}

/** Generate a Pareto-distributed number with `alpha`. */
export function pareto(alpha = 1) {
  // https://github.com/transitive-bullshit/random/blob/master/src/distributions/pareto.ts
  return 1 / Math.pow(1 - random(), 1 / alpha)
}

/** Pick a random item from a `list`, with optional `weights`. */
export function pick<T extends Narrowable>(list: T[], weights?: number[]): T
export function pick<T>(list: T[], weights?: number[]): T
export function pick<T>(list: T[], weights?: number[]): T {
  if (weights == null) return list[int(0, list.length - 1)]
  if (list.length !== weights.length)
    throw new Error('List and weights must have the same length')
  let total = weights.reduce((m, w) => m + w, 0)
  let r = float(0, total)
  let c = 0
  let i = weights.findIndex((w) => r < (c += w))
  return list[i]
}

/** Generate a Poisson-distrubted number with `mean`. */
export function poisson(mean = 1) {
  // https://github.com/jhermsmeier/rng.js/blob/master/rng.js
  let L = Math.exp(-(mean || 1))
  let k = 0
  let p = 1
  while (p > L) {
    p *= random()
    k++
  }
  return k - 1
}

/** Generate a random value between `0` and `1`. */
export function random(): number {
  let fn = globalThis.VOID?.random ?? Math.random
  return fn()
}

/** Generate rolls of an n-`sided` die, with optional number of `times`. */
export function roll(sides = 20, times = 1): number {
  let sum = 0
  for (let i = 0; i < times; i++) sum += int(1, sides)
  return sum
}

/** Pick a random sample of `size` from a `list`, with optional `weights`. */
export function sample<T extends Narrowable>(
  size: number,
  list: T[],
  weights?: number[]
): T[]
export function sample<T>(size: number, list: T[], weights?: number[]): T[]
export function sample<T>(size: number, list: T[], weights?: number[]): T[] {
  if (size > list.length)
    throw new Error(`Sample size must be less than list length`)
  let l = list.slice()
  if (size === list.length) return l
  let w = weights ? weights.slice() : undefined
  let samp: T[] = []
  for (let i = 0; i < size; i++) {
    let [idx, el] = pick(Array.from(l.entries()), w)
    samp.push(el)
    l.splice(idx, 1)
    if (w) w.splice(idx, 1)
  }
  return samp
}

/** Set the seeded prng, either until reset, or just while executing a `handler`. */
export function seed(prng: () => number): () => void
export function seed(prng: () => number, fn: () => void): void
export function seed(prng: () => number, fn?: () => void): void | (() => void) {
  let VOID = (globalThis.VOID ??= {})
  let prev = VOID.random
  let unseed = () => {
    VOID.random = prev
  }

  VOID.random = prng
  if (!fn) return unseed
  fn()
  unseed()
}

/** Generate a sign (`1` or `-1`). */
export function sign(): number {
  return bool() ? 1 : -1
}

/** Sort the elements of an array in a random order. */
export function shuffle<T extends Narrowable>(list: T[]): T[]
export function shuffle<T>(list: T[]): T[]
export function shuffle<T>(list: T[]): T[] {
  // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
  let l = list.slice()
  let i = l.length
  while (i--) {
    const j = Math.floor(random() * (i + 1))
    ;[l[i], l[j]] = [l[j], l[i]]
  }
  return l
}

/** Get a unique set of `size` random outputs from a `generator` function. */
export function unique<T>(
  size: number,
  generate: () => T,
  limit = size * 100
): T[] {
  let set = new Set<T>()
  for (let i = 0; i < limit; i++) {
    set.add(generate())
    if (set.size === size) return Array.from(set)
  }
  throw new Error(
    `Could not get ${size} unique values after ${limit} iterations`
  )
}

/** Get a random unit vector of `length`. */
export function vector(length: number): number[] {
  let vec = Array.from({ length }, () => random())
  let mag = Math.sqrt(vec.reduce((m, v) => m + v ** 2, 0))
  let unit = vec.map((v) => v / mag)
  return unit
}