import { mergeWith } from 'lodash'
import {
  Dimensions,
  Schema,
  Paper,
  Orientation,
  Units,
  TraitSchema,
  Traits,
} from '..'

/** A set of settings that have been fully resolved, without missing ones. */
export type ResolvedSettings<T extends Traits = Traits> = {
  dimensions: Dimensions<2>
  dpi: number
  margin: Dimensions<4>
  orientation: Orientation
  precision: Dimensions<1>
  schema: Schema<T>
  seed: number
  traits: T
  units: Units
}

/** The optional settings for configuring a sketch. */
export interface Settings<T extends Traits = Traits> {
  dimensions?: Dimensions<2> | Paper
  dpi?: number
  margin?: Dimensions<1> | Dimensions<2> | Dimensions<3> | Dimensions<4>
  orientation?: Orientation
  precision?: Dimensions<1>
  schema?: Partial<Record<keyof T, Partial<TraitSchema>>>
  seed?: number
  traits?: T
  units?: Units
}

export let Settings = {
  /** Merge multiple sets of `...settings` into one. */
  merge<T extends Traits>(...settings: Settings<T>[]): Settings<T> {
    return mergeWith({}, ...settings, (a: Settings<T>, b: Settings<T>) => {
      if (Array.isArray(a)) return b
    })
  },

  /** Resolve a set of settings to have no missing options. */
  resolve<T extends Traits>(settings: Settings<T>): ResolvedSettings<T> {
    let {
      dimensions = [300, 150, 'px'],
      dpi = 72,
      orientation,
      seed = 1,
      precision,
      margin,
      traits = {} as T,
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

    // Setup the sketch's variables and interface controls.
    let schema = Schema.resolve(settings)

    return {
      dimensions,
      dpi,
      margin,
      orientation,
      precision,
      schema,
      seed,
      traits,
      units,
    }
  },
}
