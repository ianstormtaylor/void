import { Math, Narrowable } from '.'
import { createNoise4D } from 'simplex-noise'
import { createPrng } from './utils'
import * as d3 from 'd3-random'

/** The current 4D noise generator, implicitly created. */
let NOISE: null | ((x: number, y: number, z: number, w: number) => number) =
  null

/** Generate a boolean, with optional probability `p` of being `true`. */
export function bool(p = 0.5): boolean {
  return random() < p
}

/** Pick a random entry from a `collection`. */
export function entry<T>(collection: T[]): [number, T]
export function entry<T>(collection: Record<string, T>): [string, T]
export function entry<K, V>(collection: Map<K, V>): [K, V]
export function entry<V>(collection: Set<V>): [V, V]
export function entry(
  collection: any[] | Record<string, any> | Map<any, any> | Set<any>
): any {
  if (
    typeof collection == 'object' &&
    collection != null &&
    Object.prototype.toString.call(collection) === '[object Object]'
  ) {
    return pick(Object.entries(collection))
  } else {
    return pick(Array.from(collection.entries()))
  }
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
export function fork<T>(fn: () => T): T {
  let s = int(0, 2 ** 32)
  let prng = createPrng(s)
  return seed(prng, fn)
}

/** Pick a random index from an `array`. */
export function index(array: any[]): number {
  return int(array.length - 1)
}

/** Generate an integer, with optional `min`, `max`, and `step`. */
export function int(min?: number, max?: number, step = 1): number {
  if (min == null) (min = 0), (max = Number.MAX_SAFE_INTEGER)
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

/** Pick a random item from a set of `choices`, with optional `weights`. */
export function pick<T extends Narrowable>(choices: T[], weights?: number[]): T
export function pick<T>(choices: T[], weights?: number[]): T
export function pick<T>(choices: T[], weights?: number[]): T {
  if (weights == null) return choices[index(choices)]
  if (choices.length !== weights.length)
    throw new Error('List and weights must have the same length')
  let total = weights.reduce((m, w) => m + w, 0)
  let r = float(0, total)
  let c = 0
  let i = weights.findIndex((w) => r < (c += w))
  return choices[i]
}

/** Generate a random value between `0` and `1`. */
export function random(): number {
  let fn = globalThis.VOID?.random ?? Math.random
  return fn()
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
export function seed<T>(prng: () => number, fn: () => T): T
export function seed<T>(prng: () => number, fn?: () => T): T | (() => void) {
  let VOID = (globalThis.VOID ??= {})
  let prev = VOID.random
  let unseed = () => {
    VOID.random = prev
  }

  VOID.random = prng
  if (!fn) return unseed
  let ret = fn()
  unseed()
  return ret
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
  return fork(() => {
    let l = list.slice()
    let i = l.length
    while (i--) {
      const j = Math.floor(random() * (i + 1))
      ;[l[i], l[j]] = [l[j], l[i]]
    }
    return l
  })
}

/** Get a unique set of `size` random outputs from a `generator` function. */
export function unique<T>(
  size: number,
  generate: () => T,
  limit = size * 100
): T[] {
  return fork(() => {
    let set = new Set<T>()
    for (let i = 0; i < limit; i++) {
      set.add(generate())
      if (set.size === size) return Array.from(set)
    }
    throw new Error(
      `Could not get ${size} unique values after ${limit} iterations`
    )
  })
}

/** Get a random unit vector of `length`. */
export function vector(length: number): number[] {
  return fork(() => {
    let vec = Array.from({ length }, () => random())
    let mag = Math.sqrt(vec.reduce((m, v) => m + v ** 2, 0))
    let unit = vec.map((v) => v / mag)
    return unit
  })
}

/**
 * Random distribution generators from D3's library, as separate exports so
 * they're all able to tree-shaked away.
 */

export let bates = d3.randomBates.source(random)
export let bernoulli = d3.randomBernoulli.source(random)
export let beta = d3.randomBeta.source(random)
export let binomial = d3.randomBinomial.source(random)
export let cauchy = d3.randomCauchy.source(random)
export let exponential = d3.randomExponential.source(random)
export let gamma = d3.randomGamma.source(random)
export let gaussian = d3.randomNormal.source(random)
export let geometric = d3.randomGeometric.source(random)
export let irwinHall = d3.randomIrwinHall.source(random)
export let logistic = d3.randomLogistic.source(random)
export let logNormal = d3.randomLogNormal.source(random)
export let normal = gaussian
export let pareto = d3.randomPareto.source(random)
export let weibull = d3.randomWeibull.source(random)
