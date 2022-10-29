import { mergeWith } from 'lodash'
import { Config } from '.'
import { Dimensions, Paper, Orientation, Units, Settings } from '..'
import { resolveOrientation } from '../utils'

/** Resolve the dimensions of a `config`. */
export function dimensions(config: Config): Dimensions<2> {
  let d = config.dimensions
  return d == null
    ? [Infinity, Infinity, 'px']
    : Paper.is(d)
    ? Paper.dimensions(d)
    : d
}

/** Resolve the margin from a `config`. */
export function margin(config: Config): Dimensions<4> {
  let { margin } = config

  if (margin == null) {
    let [, , du] = dimensions(config)
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

  return margin
}

/** Merge multiple `configs` into one. */
export function merge(...configs: Config[]): Config {
  return mergeWith({}, ...configs, (a: Config, b: Config) => {
    if (Array.isArray(a)) return b
  })
}

/** Resolve the orientation from a `config`. */
export function orientation(config: Config): Orientation {
  let { orientation } = config

  if (orientation == null) {
    let [w, h] = dimensions(config)
    orientation = resolveOrientation(w, h)
  }

  return orientation
}

/** Resolve the precision of a `config`. */
export function precision(config: Config): Dimensions<1> {
  let { precision } = config

  if (precision == null) {
    let u = config.units ?? dimensions(config)[2]
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

  return precision
}

/** Resolve the units of a `config`. */
export function units(config: Config): Units {
  let u = config.units
  return u ? u : precision(config)[1]
}
