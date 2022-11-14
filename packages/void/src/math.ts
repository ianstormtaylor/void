import { Sketch, Units, UnitsSystem } from '.'
import { CSS_CPI } from './utils'

/** The golden ratio. */
export const PHI = (1 + Math.sqrt(5)) / 2

/** Twice the value of `PI`, which is often more clear. */
export const TAU = Math.PI * 2

/** A reasonable tolerance for catching floating point precision errors. */
export const TOLERANCE = 0.000001

/** The number of degrees in one radian. */
const DEG_PER_RAD = 180 / Math.PI

/** The number of radians in one degree. */
const RAD_PER_DEG = Math.PI / 180

/** The number of inches in a meter. */
const M_PER_INCH = 0.0254

/** The number of meters in an inch. */
const INCH_PER_M = 1 / M_PER_INCH

/** Conversions for units within their respective system. */
const CONVERSIONS: Record<Exclude<Units, 'px'>, [UnitsSystem, number]> = {
  m: ['metric', 1],
  cm: ['metric', 1 / 100],
  mm: ['metric', 1 / 1000],
  in: ['imperial', 1],
  ft: ['imperial', 12],
  yd: ['imperial', 36],
  pc: ['imperial', 1 / 6],
  pt: ['imperial', 1 / 72],
}

/** Check if a `value` is included in a range between `min` and `max`. */
export function between(
  value: number,
  min: number,
  max: number,
  tolerance = TOLERANCE
): boolean {
  if (min > max) [min, max] = [max, min]
  return min + tolerance < value && value < max - tolerance
}

/** Clamp a `value` between `min` and `max` by bouncing between the two. */
export function bounce(value: number, min: number, max: number): number {
  if (min <= value && value <= max) return value
  let range = max - min
  let side = value < min ? 0 : 1
  let excess = side ? value - max : value - min
  let times = Math.abs(Math.floor(excess / range)) + side
  let remain = mod(excess, range)
  let ret = times % 2 ? max - remain : min + remain
  return ret
}

/** Round a `value` _up_ by `precision` or `multiple`. */
export function ceilTo(value: number, precision: number): number
export function ceilTo(value: number, options: { multiple: number }): number
export function ceilTo(
  value: number,
  by: number | { multiple: number }
): number {
  if (typeof by === 'number') {
    let p = 10 ** by
    return Math.ceil(value * p) / p
  } else {
    return Math.ceil(value / by.multiple) * by.multiple
  }
}

/** Clamp a `value` between `min` and `max`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** Calculate all possible combinations of a `list`, with optional `size` or `min` and `max`. */
export function combinations<T>(list: T[]): T[][]
export function combinations<T>(list: T[], size: number): T[][]
export function combinations<T>(list: T[], min: number, max: number): T[][]
export function combinations<T>(list: T[], min?: number, max?: number): T[][] {
  // https://github.com/firstandthird/combinations/blob/master/index.js
  if (min == null) (min = 1), (max = list.length)
  if (max == null) max = min
  let combos: T[][] = []
  let combine = (i: number, input: T[], picked: T[]) => {
    if (i > 0) {
      for (let [j, v] of input.entries()) {
        combine(i - 1, input.slice(j + 1), picked.concat([v]))
      }
    } else if (picked.length) {
      combos.push(picked)
    }
  }

  for (let i = min; i < list.length; i++) {
    combine(i, list, [])
  }

  if (list.length == max) {
    combos.push(list.slice())
  }

  return combos
}

/**
 * Compare a `value` to a `target`, returning `-1`, `0`, or `1` depending on
 * whether it is less than, equal to, or greater than the target.
 */

export function compare(
  value: number,
  target: number,
  tolerance?: number
): -1 | 0 | 1 {
  return equals(value, target, tolerance) ? 0 : value > target ? 1 : -1
}

/** Convert a `value` from one unit to another, defaulting to the sketch's units. */
export function convert(value: number, from: Units, to?: Units): number
export function convert(
  value: number,
  from: Units,
  options: {
    dpi?: number
    precision?: number
  }
): number
export function convert(
  value: number,
  from: Units,
  to: Units,
  options: {
    dpi?: number
    precision?: number
  }
): number
export function convert(
  value: number,
  from: Units,
  to?: Units | { dpi?: number; precision?: number },
  options: { dpi?: number; precision?: number } = {}
): number {
  if (typeof to === 'object') (options = to), (to = undefined)
  let sketch = Sketch.current()
  let s = sketch?.settings
  to = to ?? s?.units ?? 'px'
  let { dpi = s?.dpi ?? CSS_CPI, precision } = options

  // Early exit.
  if (from === to) return value

  // Swap pixels for inches using the dynamic `dpi`.
  let factor = 1
  if (from === 'px') (factor /= dpi), (from = 'in')
  if (to === 'px') (factor *= dpi), (to = 'in')

  // Swap systems if `from` and `to` aren't using the same one.
  let [inSystem, inFactor] = CONVERSIONS[from]
  let [outSystem, outFactor] = CONVERSIONS[to]
  factor *= inFactor
  factor /= outFactor
  if (inSystem !== outSystem) {
    factor *= inSystem === 'metric' ? INCH_PER_M : M_PER_INCH
  }

  // Calculate the result and optionally round to a fixed number of digits.
  let result = value * factor
  if (precision != null) result = Math.round(result / precision) * precision
  return result
}

/** Convert an angle in `radians` to degrees. */
export function degrees(radians: number): number {
  return radians * DEG_PER_RAD
}

/** Ease a normalized value `t` _in_ by a polynomial power `p`. */
export function easeIn(t: number, p = 2): number {
  return t ** p
}

/** Ease a normalized value `t` _out_ by a polynomial power `p`. */
export function easeOut(t: number, p = 2): number {
  return 1 - (1 - t) ** p
}

/** Ease a normalized value `t` _in then out_ by a polynomial power `p`. */
export function easeInOut(t: number, p = 2): number {
  return ((t *= 2) <= 1 ? easeIn(t, p) : 1 + easeOut(t - 1, p)) / 2
}

/** Ease a normalized value `t` _out then in_ by a polynomial power `p`. */
export function easeOutIn(t: number, p = 2): number {
  return ((t *= 2) <= 1 ? easeOut(t, p) : 1 + easeIn(t - 1, p)) / 2
}

/** Check if `a` and `b` are equal, with optional `tolerance`. */
export function equals(a: number, b: number, tolerance = TOLERANCE): boolean {
  return a === b || Math.abs(a - b) <= tolerance
}

/** Calculate the extent of a list of `numbers`. */
export function extent(...numbers: number[]): [number, number] {
  let min = Infinity
  let max = -Infinity

  for (let n of numbers) {
    if (isNaN(n)) continue
    if (n == null) n = 0
    if (min > n) min = n
    if (max < n) max = n
  }

  return [min, max]
}

/** Calculate the factorial of a `value`. */
export function factorial(value: number): number {
  // https://github.com/mathigon/fermat.js/blob/master/src/combinatorics.ts
  if (value === 0) return 1
  if (value < 0) return NaN
  let n = 1
  for (let i = 2; i <= value; ++i) n *= i
  return n
}

/** Round a `value` _down_ by `precision` or `multiple`. */
export function floorTo(value: number, precision: number): number
export function floorTo(value: number, options: { multiple: number }): number
export function floorTo(
  value: number,
  by: number | { multiple: number }
): number {
  if (typeof by === 'number') {
    let p = 10 ** by
    return Math.floor(value * p) / p
  } else {
    return Math.floor(value / by.multiple) * by.multiple
  }
}

/** Calculate the greatest common divisor of a set of `numbers`. */
export function gcd(...numbers: number[]): number {
  // https://github.com/mathigon/fermat.js/blob/master/src/number-theory.ts
  let [a, ...rest] = numbers
  if (rest.length > 1) return gcd(a, gcd(...rest))
  let [b] = rest
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

/** Hash an integer `x` into another integer, from `0` to `2^32`. */
export function hash(x: number): number {
  // https://github.com/skeeto/hash-prospector
  x = (x ^ (x >>> 16)) >>> 0
  x = Math.imul(x, 569420461)
  x = (x ^ (x >>> 15)) >>> 0
  x = Math.imul(x, 1935289751)
  x = (x ^ (x >>> 15)) >>> 0
  return x
}

/** Calculate the least common multiple of a set of `numbers`. */
export function lcm(...numbers: number[]): number {
  let [a, ...rest] = numbers
  if (rest.length > 1) return lcm(a, lcm(...rest))
  let [b] = rest
  return Math.abs(a * b) / gcd(a, b)
}

/** Linearly interpolate between `a` and `b` by a normalized amount `t`. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Linearly interpolate an angle in degrees between `a` and `b` by a normalized amount `t`. */
export function lerpAngle(a: number, b: number, t: number): number {
  let diff = mod(b - a, 360)
  let end = a + (diff > 180 ? diff - 360 : diff)
  return mod(lerp(a, end, t), 360)
}

/** Calculate the logarithm of `value`, with optional `base`. */
export function log(value: number, base?: number): number {
  return base == null ? Math.log(value) : Math.log(value) / Math.log(base)
}

/** Map a `value` between `inMin` and `inMax` to a new scale between `outMin` and `outMax`. */
export function map(
  value: number,
  inA: number,
  inB: number,
  outA: number,
  outB: number
): number {
  return lerp(outA, outB, unlerp(inA, inB, value))
}

/** Calculate the mean of a set of `numbers`. */
export function mean(...numbers: number[]): number | undefined {
  if (!numbers.length) return NaN
  return sum(...numbers) / numbers.length
}

/** Calculate the median of a set of `numbers`. */
export function median(...numbers: number[]): number | undefined {
  return quantile(numbers, 0.5)
}

/** Calculate the (unsigned) modulo of a `value` and `modulus`. */
export function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus
}

/** Find the mode of a set of `values`. */
export function mode<T>(...values: T[]): T | undefined {
  if (!values.length) return
  let counts = new Map<T, number>()

  for (let n of values) {
    counts.set(n, (counts.get(n) ?? 0) + 1)
  }

  let mode: T
  let max = 0

  for (let [n, count] of counts) {
    if (count > max) {
      max = count
      mode = n
    }
  }

  return mode!
}

/** Get all the permutations of a `list`. */
export function permutations<T>(list: T[]): T[][] {
  // https://github.com/mathigon/fermat.js/blob/master/src/combinatorics.ts
  let perms: T[][] = []
  let used: T[] = []
  let permute = (input: T[]) => {
    for (let i = 0; i < input.length; i++) {
      let [v] = input.splice(i, 1)
      used.push(v)
      if (!input.length) perms.push(used.slice())
      permute(input)
      input.splice(i, 0, v)
      used.pop()
    }
  }

  permute(list)
  return perms
}

/** Calculate the quantile `p` of a set of `values`. */
export function quantile(
  values: number[],
  p: number,
  options?: { sorted?: boolean }
): number {
  // https://github.com/mathigon/fermat.js/blob/master/src/statistics.ts
  let { length } = values
  if (!length) return NaN
  if (length === 1) return values[0]
  if (!options?.sorted) values = values.slice().sort((a, b) => a - b)
  if (p === 0) return values[0]
  if (p === 1) return values.at(-1)!
  let index = p * (length - 1)
  if (Number.isInteger(index)) return values[index]
  let i = Math.floor(index)
  let q = lerp(values[i], values[i + 1], index - i)
  return q
}

/** Convert an angle in `degrees` to radians. */
export function radians(degrees: number): number {
  return degrees * RAD_PER_DEG
}

/** Return a range of numbers from `start` to `end`, with optional `step` to increment by. */
export function range(length: number): Generator<number, void, void>
export function range(
  start: number,
  end: number,
  step?: number
): Generator<number, void, void>
export function* range(
  start: number,
  end?: number,
  step: number = 1
): Generator<number, void, void> {
  // https://github.com/mathigon/core.js/blob/master/src/arrays.ts
  if (end === undefined && start >= 0) {
    for (let i = 0; i < start; i += step) yield i
  } else if (end === undefined) {
    for (let i = 0; i > start; i -= step) yield i
  } else if (start <= end) {
    for (let i = start; i <= end; i += step) yield i
  } else {
    for (let i = start; i >= end; i -= step) yield i
  }
}

/** Group a `list` into tuples with a rolling window of `size`. */
export function rolling<T>(list: T[], size: 2): [T, T][]
export function rolling<T>(list: T[], size: 3): [T, T, T][]
export function rolling<T>(list: T[], size: 4): [T, T, T, T][]
export function rolling<T>(list: T[], size: number): T[][]
export function rolling<T>(list: T[], size: number): T[][] {
  if (list.length < size) return []
  return Array.from(range(0, list.length - size), (i) =>
    list.slice(i, i + size)
  )
}

/** Round a `value`, with optional `precision` or `multiple`. */
export function roundTo(value: number, precision: number): number
export function roundTo(value: number, options: { multiple: number }): number
export function roundTo(
  value: number,
  by: number | { multiple: number }
): number {
  if (typeof by === 'number') {
    let p = 10 ** by
    return Math.round(value * p) / p
  } else {
    return Math.round(value / by.multiple) * by.multiple
  }
}

/** Spherically interpolate between `a` and `b` by a normalized amount `t` around an angle in `degrees`. */
export function slerp(
  a: number,
  b: number,
  degrees: number,
  t: number
): number {
  let r = radians(degrees)
  let s = Math.sin(r)
  return Math.sin((1 - t) * r) * s * a + Math.sin(t * r) * s * b
}

/** Split a range into `n` chunks with normalized start and end edges. */
export function split(
  a: number,
  b: number,
  chunks: number
): [number, number][] {
  return Array.from({ length: chunks }, (_, i) => [
    lerp(a, b, i / chunks),
    lerp(a, b, (i + 1) / chunks),
  ])
}

/** Calculate the standard deviation of a set of `numbers`. */
export function stddev(...numbers: number[]): number {
  return Math.sqrt(variance(...numbers))
}

/** Subdivide a range from `a` to `b` with a number of `times`. */
export function subdivide(a: number, b: number, times: number): number[] {
  if (times === 1) return [lerp(a, b, 0.5)]
  return Array.from(range(times), (i) => lerp(a, b, i / (times - 1)))
}

/** Calculate the sum of a set of `numbers` */
export function sum(...numbers: number[]): number {
  return numbers.reduce((m, n) => m + n, 0)
}

/** Round a `value` towards zero by `precision` or `multiple`. */
export function truncTo(value: number, precision: number): number
export function truncTo(value: number, options: { multiple: number }): number
export function truncTo(
  value: number,
  by: number | { multiple: number }
): number {
  if (typeof by === 'number') {
    let p = 10 ** by
    return Math.trunc(value * p) / p
  } else {
    return Math.trunc(value / by.multiple) * by.multiple
  }
}

/** Un-hash an integer `x` back into another integer, from `0` to `2^32`. */
export function unhash(x: number): number {
  // https://github.com/skeeto/hash-prospector
  x = (x ^ (x >>> 15) ^ (x >>> 30)) >>> 0
  x = Math.imul(x, 2534613543)
  x = (x ^ (x >>> 15) ^ (x >>> 30)) >>> 0
  x = Math.imul(x, 859588901)
  x = (x ^ (x >>> 16)) >>> 0
  return x
}

/** Un-interpolate a `value` between `a` and `b`, to a normalized amount. */
export function unlerp(a: number, b: number, value: number): number {
  if (equals(b - a, 0)) return 0
  return (value - a) / (b - a)
}

/** Calculate the variance of a set of `numbers`. */
export function variance(...numbers: number[]): number {
  // https://github.com/d3/d3-array/blob/main/src/variance.js
  let count = 0
  let delta
  let mean = 0
  let sum = 0
  for (let n of numbers) {
    delta = n - mean
    mean += delta / ++count
    sum += delta * (n - mean)
  }
  return sum / (count - 1)
}

/** Wrap a `value` between a `min` and `max`. */
export function wrap(
  value: number,
  min: number,
  max: number,
  inclusive?: boolean
): number {
  // https://github.com/mattdesl/canvas-sketch-util/blob/master/lib/wrap.js
  var range = max - min
  return equals(range, 0)
    ? max
    : inclusive && equals(value, max)
    ? max
    : value - range * Math.floor((value - min) / range)
}

/**
 * Export all of the existing `Math` and `Number` methods, so they can be used
 * without switching between the two namespaces.
 *
 * Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math
 */

let {
  E,
  LN2,
  LN10,
  LOG2E,
  LOG10E,
  PI,
  SQRT1_2,
  SQRT2,
  abs,
  acos,
  acosh,
  asin,
  atan,
  atanh,
  atan2,
  cbrt,
  ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  floor,
  fround,
  hypot,
  imul,
  log1p,
  log10,
  log2,
  max,
  min,
  pow,
  random,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  trunc,
} = Math
export {
  E,
  LN2,
  LN10,
  LOG2E,
  LOG10E,
  PI,
  SQRT1_2,
  SQRT2,
  abs,
  acos,
  acosh,
  asin,
  atan,
  atanh,
  atan2,
  cbrt,
  ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  floor,
  fround,
  hypot,
  imul,
  log1p,
  log10,
  log2,
  max,
  min,
  pow,
  random,
  round,
  sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
  trunc,
}
