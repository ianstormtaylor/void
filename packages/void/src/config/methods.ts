import { mergeWith } from 'lodash'
import { Config } from '.'
import { Sizes, Size, Orientation, Units, Math, Sketch } from '..'
import { resolveOrientation } from '../utils'

/** Resolve the dimensions of a `config`. */
export function dimensions(config: Config): Sizes<2> {
  let d = config.dimensions
  return d == null
    ? [Infinity, Infinity, 'px']
    : Size.is(d)
    ? Size.dimensions(d)
    : d
}

/** Resolve the margin from a `config`. */
export function margin(config: Config): Sizes<4> {
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
export function precision(config: Config): Sizes<1> {
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

/** Get the fully resolved `Settings` object a `config`. */
export function settings(config: Config): Sketch['settings'] {
  let { dpi = 72, fps = 60, frames = Infinity, seed = 1 } = config
  let orientation = Config.orientation(config)
  let units = Config.units(config)

  // Convert the precision to the sketch's units.
  let [precision, pu] = Config.precision(config)
  precision = Math.convert(precision, pu, units, { dpi })

  // Create a unit conversion helper with the sketch's default units.
  let [width, height, du] = Config.dimensions(config)
  width = Math.convert(width, du, units, { precision, dpi })
  height = Math.convert(height, du, units, { precision, dpi })

  // Apply the orientation setting to the dimensions.
  if (orientation === 'square' && width != height) {
    width = height = Math.min(width, height)
  } else if (orientation === 'landscape' && width < height) {
    ;[width, height] = [height, width]
  } else if (orientation === 'portrait' && height < width) {
    ;[width, height] = [height, width]
  }

  // Apply a margin, so the canvas is drawn without need to know it.
  let [mt, mr, mb, ml, mu] = Config.margin(config)
  mt = Math.convert(mt, mu, units, { precision, dpi })
  mr = Math.convert(mr, mu, units, { precision, dpi })
  mb = Math.convert(mb, mu, units, { precision, dpi })
  ml = Math.convert(ml, mu, units, { precision, dpi })
  width -= mr + ml
  height -= mt + mb
  let margin = [mt, mr, mb, ml] as [number, number, number, number]

  return {
    dpi,
    fps,
    frames,
    height,
    margin,
    precision,
    seed,
    units,
    width,
  }
}

/** Resolve the units of a `config`. */
export function units(config: Config): Units {
  let u = config.units
  return u ? u : precision(config)[1]
}
