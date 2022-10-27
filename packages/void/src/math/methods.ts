import { Units, UnitsSystem } from '../interfaces/units'
import { Sketch } from '../sketch'

/** The golden ratio. */
export const PHI = (1 + Math.sqrt(5)) / 2

/** Twice the value of `PI`, which is often more clear. */
export const TAU = Math.PI * 2

/** A reasonable tolerance for catching floating point precision errors. */
export const TOLERANCE = 0.000001

/** The number of degrees in one radian. */
export const DEG_PER_RAD = 180 / Math.PI

/** The number of radians in one degree. */
export const RAD_PER_DEG = Math.PI / 180

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

/** Round a `value` _up_ to the nearest `multiple`. */
export function ceil(value: number): number
export function ceil(value: number, precision: number): number
export function ceil(
  value: number,
  options: { precision: number } | { multiple: number }
): number
export function ceil(
  value: number,
  options?: number | { precision: number } | { multiple: number }
): number {
  if (options == null) return Math.ceil(value)
  if (typeof options === 'number') options = { precision: options }
  let by =
    'multiple' in options ? 1 / options.multiple : 10 ** options.precision
  return Math.ceil(value * by) / by
}

/** Clamp a `value` between `min` and `max`. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

/** A constant to convert from inches to meters to change unit systems. */
const IN_TO_M = 0.0254

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

/** Convert a `value` in `units` to the sketch's default units. */
export function convert(
  value: number,
  from: Units,
  options: {
    to?: Units
    dpi?: number
    precision?: number
  } = {}
): number {
  let settings = Sketch.current()?.state?.settings
  let {
    to = settings?.units ?? 'px',
    dpi = settings?.dpi ?? 72,
    precision,
  } = options

  // Early exit.
  if (from === to) return value

  // Swap pixels for inches using the dynamic `dpi`.
  let factor = 1
  if (from === 'px') (factor /= dpi), (from = 'in')
  if (to === 'px') (factor *= dpi), (to = 'in')

  // Swap systems if `from` and `to` aren't using the same one.
  let [inS, inF] = CONVERSIONS[from]
  let [outS, outF] = CONVERSIONS[to]
  factor *= inF
  factor /= outF
  if (inS !== outS) factor *= inS === 'metric' ? 1 / IN_TO_M : IN_TO_M

  // Calculate the result and optionally round to a fixed number of digits.
  let result = (value *= factor)
  if (precision != null) result = Math.round(value / precision) * precision
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
  return Math.abs(a - b) <= tolerance
}

/** Round a number _down_ to the nearest `multiple`. */
export function floor(value: number, multiple = 1): number {
  return Math.floor(value / multiple) * multiple
}

/** Check if a `value` is between `a` and `b`. */
export function isBetween(
  value: number,
  a: number,
  b: number,
  tolerance = TOLERANCE
): boolean {
  if (a > b) [a, b] = [b, a]
  return a + tolerance < value && value < b - tolerance
}

/** Check if a `value` is an integer. */
export function isInteger(value: number, tolerance = TOLERANCE): boolean {
  return equals(value % 1, 0, tolerance)
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

/** Calculate the mean of a set of `numbers` */
export function mean(...numbers: number[]): number {
  return sum(...numbers) / numbers.length
}

/** Calculate the (unsigned) modulo of a `value` and `modulus`. */
export function mod(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus
}

/** Find the mode of a set of `numbers`. */
// export function mode(...numbers: [number, ...number[]]): number {
//   let counts = new Map<number, number>()

//   for (let n of numbers) {
//     counts.set(n, (counts.get(n) ?? 0) + 1)
//   }

//   let mode
//   let max = 0

//   for (let [n, count] of counts) {
//     if (count > max) {
//       max = count
//       mode = n
//     }
//   }

//   return mode
// }

/** Convert an angle in `degrees` to radians. */
export function radians(degrees: number): number {
  return degrees * RAD_PER_DEG
}

/** Return a range of numbers from `a` to `b`. */
export function range(a: number, b: number, step?: number): number[]
export function range(length: number): number[]
export function range(a: number, b?: number, step?: number): number[] {
  // https://github.com/mathigon/core.js/blob/master/src/arrays.ts
  const r: number[] = []
  step = step || 1

  if (b === undefined && a >= 0) {
    for (let i = 0; i < a; i += step) r.push(i)
  } else if (b === undefined) {
    for (let i = 0; i > a; i -= step) r.push(i)
  } else if (a <= b) {
    for (let i = a; i <= b; i += step) r.push(i)
  } else {
    for (let i = a; i >= b; i -= step) r.push(i)
  }
  return r
}

/** Group a `list` into tuples with a rolling window of `size`. */
export function roll<T>(list: T[], size: 2): [T, T][]
export function roll<T>(list: T[], size: 3): [T, T, T][]
export function roll<T>(list: T[], size: 4): [T, T, T, T][]
export function roll<T>(list: T[], size: number): T[][]
export function roll<T>(list: T[], size: number): T[][] {
  if (list.length < size) return []
  return range(0, list.length - size).map((i) => list.slice(i, i + size))
}

/** Round a number to the nearest `multiple`. */
export function round(value: number, multiple = 1): number {
  return Math.round(value / multiple) * multiple
}

/** Scale a `value` between `inMin` and `inMax` to a new scale between `outMin` and `outMax`. */
export function scale(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  let t = unlerp(inMin, inMax, value)
  let v = lerp(outMin, outMax, t)
  return v
}

/** Get the sign of a number, with optional `tolerance`. */
export function sign(value: number, tolerance?: number): 1 | 0 | -1 {
  return equals(value, 0, tolerance) ? 0 : value > 0 ? 1 : -1
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
  return range(chunks).map((i) => [
    lerp(a, b, i / chunks),
    lerp(a, b, (i + 1) / chunks),
  ])
}

/** Subdivide a range from `a` to `b` with a number of `times`. */
export function subdivide(a: number, b: number, times: number): number[] {
  if (times === 1) return [lerp(a, b, 0.5)]
  return range(times).map((i) => lerp(a, b, i / (times - 1)))
}

/** Calculate the sum of a set of `numbers` */
export function sum(...numbers: number[]): number {
  return numbers.reduce((m, n) => m + n, 0)
}

/** Un-interpolate a `value` between `a` and `b`, to a normalized amount. */
export function unlerp(a: number, b: number, value: number): number {
  if (equals(b - a, 0)) return 0
  return (value - a) / (b - a)
}

/** Wrap a `value` between a `min` and `max`. */
export function wrap(
  value: number,
  min: number,
  max: number,
  inclusive = false
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
 * Export all of the existing `Math` constants and methods, so they can be used
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
  // ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  // floor,
  fround,
  hypot,
  imul,
  log,
  log1p,
  log10,
  log2,
  max,
  min,
  pow,
  random,
  // round,
  // sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
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
  // ceil,
  clz32,
  cos,
  cosh,
  exp,
  expm1,
  // floor,
  fround,
  hypot,
  imul,
  log,
  log1p,
  log10,
  log2,
  max,
  min,
  pow,
  random,
  // round,
  // sign,
  sin,
  sinh,
  sqrt,
  tan,
  tanh,
}
