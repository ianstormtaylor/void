import { cloneDeep } from 'lodash'
import { convert, Orientation, Traits, Units, ResolvedSettings } from '..'

export type Scene<T extends Traits = Traits> = {
  dpi: number
  height: number
  margin: [number, number, number, number]
  orientation: Orientation
  precision: number
  seed: number
  traits: T
  units: Units
  width: number
}

/** A sketch object, with settings and helpers. */
export function createScene<T extends Traits>(
  settings: ResolvedSettings<T>
): Scene<T> {
  let { dpi, seed, orientation, units } = settings
  let to = units

  // Convert the precision to the sketch's units.
  let [precision, pu] = settings.precision
  precision = convert(precision, pu, { to, dpi })

  // Create a unit conversion helper with the sketch's default units.
  let [width, height, du] = settings.dimensions
  width = convert(width, du, { to, precision, dpi })
  height = convert(height, du, { to, precision, dpi })

  // Apply the orientation setting to the dimensions.
  if (orientation === 'square' && width != height) {
    width = height = Math.min(width, height)
  } else if (orientation === 'landscape' && width < height) {
    ;[width, height] = [height, width]
  } else if (orientation === 'portrait' && height < width) {
    ;[width, height] = [height, width]
  }

  // Apply a margin, so the canvas is drawn without knowing it.
  let [mt, mr, mb, ml, mu] = settings.margin
  mt = convert(mt, mu, { to, precision, dpi })
  mr = convert(mr, mu, { to, precision, dpi })
  mb = convert(mb, mu, { to, precision, dpi })
  ml = convert(ml, mu, { to, precision, dpi })
  width -= mr + ml
  height -= mt + mb
  let margin = [mt, mr, mb, ml] as [number, number, number, number]

  // Clone the traits so they aren't modified.
  let traits = cloneDeep(settings.traits)

  return {
    dpi,
    height,
    margin,
    orientation,
    precision,
    seed,
    traits,
    units,
    width,
  }
}
