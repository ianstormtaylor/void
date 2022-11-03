import { createNoise4D } from 'simplex-noise'
import { Sketch } from '..'
import { random } from './methods'

/** A reference to the sketch's seeded 4D noise function. */
let NOISE_REFS = new WeakMap<
  Sketch,
  (x: number, y: number, z: number, w: number) => number
>()

/** An un-seeded 4D noise function for when no scene is active. */
let UNSEEDED_NOISE: (x: number, y: number, z: number, w: number) => number

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
  let {
    amplitude = 1.0,
    frequency = 1,
    lacunarity = 2,
    octaves = 4,
    persistence = 0.5,
  } = options
  let sketch = Sketch.current()
  let fn
  let sum = 0
  let max = 0

  if (sketch == null) {
    fn = UNSEEDED_NOISE ??= createNoise4D()
  } else {
    fn = NOISE_REFS.get(sketch)
    if (fn == null) {
      fn = createNoise4D(random)
      NOISE_REFS.set(sketch, fn)
    }
  }

  // https://catlikecoding.com/unity/tutorials/pseudorandom-noise/noise-variants/
  for (let o = 0; o < octaves; o++) {
    let n = fn(x * frequency, y * frequency, z * frequency, w * frequency)
    sum += n * amplitude
    max += amplitude
    amplitude *= persistence
    frequency *= lacunarity
  }

  sum /= 2 - 1 / 2 ** (octaves - 1)
  return sum / max
}
