import { Math, Sketch } from '..'

// Export noise functions.
export * from './noise'

/** A reference to the sketch's seeded random function. */
let RANDOM_REFS = new WeakMap<Sketch, () => number>()

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

/** Pick a random item from a `list`, with optional `weights`. */
export function choice<T>(list: T[], weights?: number[]): T {
  if (weights == null) return list[int(0, list.length - 1)]
  if (list.length !== weights.length)
    throw new Error('List and weights must have the same length')
  let total = weights.reduce((m, w) => m + w, 0)
  let r = float(0, total)
  let c = 0
  let i = weights.findIndex((w) => r < (c += w))
  return list[i]
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

/** Generate an integer, with optional `min`, `max`, and `step`. */
export function int(min?: number, max?: number, step = 1): number {
  if (min == null) (min = 0), (max = 1)
  if (max == null) (max = min), (min = 0)
  return float(min, max, step)
}

/** Generate a Pareto-distributed number with `alpha`. */
export function pareto(alpha = 1) {
  // https://github.com/transitive-bullshit/random/blob/master/src/distributions/pareto.ts
  return 1 / Math.pow(1 - random(), 1 / alpha)
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

/** Create a pseudo-random number generator with a `seed`. */
export function of(seed: number): () => number {
  // https://en.wikipedia.org/wiki/Linear_congruential_generator
  // https://github.com/processing/p5.js/blob/main/src/math/random.js
  let M = 2 ** 32
  let A = 1664525
  let C = 1013904223
  seed = seed >>> 0
  return () => (seed = (A * seed + C) % M) / M
}

/** Generate a random value between `0` and `1`. */
export function random(): number {
  let sketch = Sketch.current()
  let r

  if (sketch == null) {
    r = Math.random
  } else {
    r = RANDOM_REFS.get(sketch) ?? of(sketch.settings.seed)
    RANDOM_REFS.set(sketch, r)
  }

  return r()
}

/** Generate rolls of an n-`sided` die, with optional number of `times`. */
export function roll(sides = 20, times = 1): number {
  let sum = 0
  for (let i = 0; i < times; i++) sum += int(1, sides)
  return sum
}

/** Pick a random sample of `size` from a `list`, with optional `weights`. */
export function sample<T>(size: number, list: T[], weights?: number[]): T[] {
  if (size > list.length)
    throw new Error(`Sample size must be less than list length`)
  let l = list.slice()
  if (size === list.length) return l
  let w = weights ? weights.slice() : undefined
  let samp: T[] = []
  for (let i = 0; i < size; i++) {
    let [idx, el] = choice(Array.from(l.entries()), w)
    samp.push(el)
    l.splice(idx, 1)
    if (w) w.splice(idx, 1)
  }
  return samp
}

/** Generate a sign (`1` or `-1`). */
export function sign(): number {
  return bool() ? 1 : -1
}

/** Sort the elements of an array in a random order. */
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
