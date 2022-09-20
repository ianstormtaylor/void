import seeded from 'seed-random'
import SimplexNoise from 'simplex-noise'

/** Create randomness helpers with a `seed`. */
export class Random {
  /** Generate a random number from `0` up to `1` (but not including). */
  #random: () => number
  #simplex: SimplexNoise

  /** Create randomness helpers with a `seed`. */
  constructor(seed: number) {
    this.#random = seeded(`${seed}`)
    this.#simplex = new SimplexNoise(seed)
  }

  /** Generate a binomially-distributed number with `n` tries and `p` probability. */
  binomial(n = 1, p = 0.5) {
    let x = 0
    for (let i = 0; i < n; i++) x += this.#random() < p ? 1 : 0
    return x
  }

  /** Generate a boolean, with optional probability `p` of being `true`. */
  bool(p = 0.5): boolean {
    return this.#random() < p
  }

  /** Generate either `0` or `1`, with optional probability `p` of success. */
  coin(p = 0.5): 0 | 1 {
    return this.#random() < p ? 1 : 0
  }

  /** Generate an exponentially-distributed number with `lambda`. */
  exponential(lambda = 1) {
    // https://github.com/transitive-bullshit/random/blob/master/src/distributions/exponential.ts
    return Math.log(1 - this.#random()) / -lambda
  }

  /** Generate a normally-distributed number with `mean` and `variance`. */
  gaussian(mean = 0, variance = 1): number {
    // https://stackoverflow.com/a/36481059/154765
    let a = this.#random()
    let b = this.#random()
    let r = Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b)
    return r * Math.sqrt(variance) + mean
  }

  /** Generate a geometrically-distributed number with probability `p`. */
  geometric(p = 0.5) {
    // https://github.com/transitive-bullshit/random/blob/master/src/distributions/geometric.ts
    return (1 + Math.log(this.#random()) * (1 / Math.log(1 - p))) | 0
  }

  /** Generate a floating point number, with optional `min` and `max`. */
  float(min?: number, max?: number): number {
    if (min == null) (min = 0), (max = 1)
    if (max == null) (max = min), (min = 0)
    return min + this.#random() * (max - min)
  }

  /** Generate an integer, with optional `min` and `max`. */
  int(min?: number, max?: number): number {
    if (min == null) (min = 0), (max = 1)
    if (max == null) (max = min), (min = 0)
    return Math.floor(this.float(min, max + 1))
  }

  /** Pick a random item from a `list`, with optional `weights`. */
  item<T>(list: T[], weights?: number[]): T {
    if (weights == null) return list[this.int(0, list.length - 1)]
    if (list.length !== weights.length)
      throw new Error('List and weights must have the same length')
    let total = weights.reduce((m, w) => m + w, 0)
    let r = this.float(0, total)
    let c = 0
    let i = weights.findIndex((w) => r < (c += w))
    return list[i]
  }

  /** Generate seeded simplex noise from `x`, `y`, `z`, and `w` coordinates. */
  noise(x: number, y?: number, z?: number, w?: number): number {
    if (y == null) {
      return this.#simplex.noise2D(x, 0)
    } else if (z == null) {
      return this.#simplex.noise2D(x, y)
    } else if (w == null) {
      return this.#simplex.noise3D(x, y, z)
    } else {
      return this.#simplex.noise4D(x, y, z, w)
    }
  }

  /** Generate a Pareto-distributed number with `alpha`. */
  pareto(alpha = 1) {
    // https://github.com/transitive-bullshit/random/blob/master/src/distributions/pareto.ts
    return 1 / Math.pow(1 - this.#random(), 1 / alpha)
  }

  /** Generate a Poisson-distrubted number with `mean`. */
  poisson(mean = 1) {
    // https://github.com/jhermsmeier/rng.js/blob/master/rng.js
    let L = Math.exp(-(mean || 1))
    let k = 0
    let p = 1
    while (p > L) {
      p *= this.#random()
      k++
    }
    return k - 1
  }

  /** Generate rolls of an n-`sided` die, with optional number of `times`. */
  roll(sides = 20, times = 1): number {
    let sum = 0
    for (let i = 0; i < times; i++) sum += this.int(1, sides)
    return sum
  }

  /** Generate a sample of `size` from a `list`. */
  sample<T>(size: number, list: T[], weights?: number[]): T[] {
    if (size === list.length) return list
    if (size > list.length)
      throw new Error(`Sample size must be less than list length`)
    let l = list.slice()
    let w = weights ? weights.slice() : undefined
    let samp = []
    for (let i = 0; i < size; i++) {
      let [idx, el] = this.item(Array.from(l.entries()), w)
      samp.push(el)
      l.splice(idx, 1)
      if (w) w.splice(idx, 1)
    }
    return samp
  }

  /** Generate a sign (`1` or `-1`). */
  sign(): number {
    return this.bool() ? 1 : -1
  }

  /** Sort the elements of an array in a random order. */
  shuffle<T>(list: T[]): T[] {
    // https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    let l = list.slice()
    let i = l.length
    while (i--) {
      const j = Math.floor(this.#random() * (i + 1))
      ;[l[i], l[j]] = [l[j], l[i]]
    }
    return l
  }

  /** Get a uniformally distributed number between `0` and `1` (exclusive). */
  uniform(): number {
    return this.#random()
  }

  /** Get a unique set of `size` random outputs from a `generator` function. */
  unique<T>(size: number, generate: () => T, limit = size * 100): T[] {
    let set = new Set<T>()
    for (let i = 0; i < limit; i++) {
      set.add(generate())
      if (set.size === size) return Array.from(set)
    }
    throw new Error(
      `Could not get ${size} unique values after ${limit} iterations`
    )
  }

  /** Get a random vector of `length`. */
  vector(length: number): number[] {
    return Array.from({ length }, (_) => this.#random())
  }
}
