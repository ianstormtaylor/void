import { Config } from '.'
import { Sizes, Size, Orientation, Units } from '..'
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

/** Resolve the orientation from a `config`. */
export function orientation(config: Config): Orientation | undefined {
  let { orientation } = config

  if (orientation == null) {
    let [w, h] = dimensions(config)
    orientation =
      w === Infinity || h === Infinity ? undefined : resolveOrientation(w, h)
  }

  return orientation
}

/** Resolve the precision of a `config`. */
export function precision(config: Config): [number, Units] {
  let u = units(config)
  let p = u === 'px' ? 1 : 0
  return config.precision ?? [p, u]
}

/** Resolve the units of a `config`. */
export function units(config: Config): Units {
  return config.units ?? dimensions(config)[2]
}
