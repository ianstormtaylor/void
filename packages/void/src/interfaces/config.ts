import { mergeWith } from 'lodash'
import { Dimensions, Paper, Orientation, Units } from '..'

/** The optional configuration when setting up a sketch. */
export interface Options {
  dimensions?: Dimensions<2> | Paper
  dpi?: number
  fps?: number
  layers?: Record<string, boolean>
  margin?: Dimensions<1> | Dimensions<2> | Dimensions<3> | Dimensions<4>
  orientation?: Orientation
  precision?: Dimensions<1>
  seed?: number
  traits?: Record<string, any>
  units?: Units
}

/** The fully-resolved configuration for a sketch, without missing entries. */
export type Config = {
  dimensions: Dimensions<2>
  dpi: number
  fps: number
  margin: Dimensions<4>
  orientation: Orientation
  precision: Dimensions<1>
  seed: number
  units: Units
}

export let Config = {
  /** Resolve a set of settings from a set of `options` objects. */
  create(...array: Options[]): Config {
    let settings = mergeWith({}, ...array, (a: Options, b: Options) => {
      if (Array.isArray(a)) return b
    })

    let {
      dimensions = [300, 150, 'px'],
      dpi = 72,
      fps = 60,
      orientation,
      seed = 1,
      precision,
      margin,
      units,
    } = settings

    if (Paper.is(dimensions)) {
      dimensions = Paper.dimensions(dimensions)
    }

    if (precision == null) {
      let u = units != null ? units : dimensions[2]
      if (u == 'px') {
        precision = [1, 'px']
      } else if (u == 'mm' || u == 'cm' || u == 'm') {
        precision = [1, 'mm']
      } else if (u == 'pt' || u == 'pc' || u == 'in' || u == 'ft') {
        precision = [1, 'pt']
      } else {
        throw new Error(`Unrecognized units: ${u}`)
      }
    }

    if (units == null) {
      units = precision[1]
    }

    if (orientation == null) {
      let [width, height] = dimensions
      orientation =
        width === height ? 'square' : width < height ? 'portrait' : 'landscape'
    }

    if (margin == null) {
      let [, , du] = dimensions
      margin = [0, 0, 0, 0, du]
    } else if (margin.length === 2) {
      let [a, mu] = margin
      margin = [a, a, a, a, mu]
    } else if (margin.length === 3) {
      let [v, h, mu] = margin
      margin = [v, h, v, h, mu]
    } else if (margin.length === 4) {
      let [t, h, b, mu] = margin
      margin = [t, h, b, h, mu]
    }

    return {
      dimensions,
      dpi,
      fps,
      margin,
      orientation,
      precision,
      seed,
      units,
    }
  },
}
