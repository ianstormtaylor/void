import { Config, Math, Settings } from '..'

/** Create a settings object from fully resolved `config`. */
export function from(config: Config): Settings {
  let { dpi = 72, fps = 60, frames = Infinity, seed = 1 } = config
  let orientation = Config.orientation(config)
  let units = Config.units(config)
  let to = units

  // Convert the precision to the sketch's units.
  let [precision, pu] = Config.precision(config)
  precision = Math.convert(precision, pu, { to, dpi })

  // Create a unit conversion helper with the sketch's default units.
  let [width, height, du] = Config.dimensions(config)
  width = Math.convert(width, du, { to, precision, dpi })
  height = Math.convert(height, du, { to, precision, dpi })

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
  mt = Math.convert(mt, mu, { to, precision, dpi })
  mr = Math.convert(mr, mu, { to, precision, dpi })
  mb = Math.convert(mb, mu, { to, precision, dpi })
  ml = Math.convert(ml, mu, { to, precision, dpi })
  width -= mr + ml
  height -= mt + mb
  let margin = [mt, mr, mb, ml] as [number, number, number, number]

  return {
    dpi,
    fps,
    frames,
    height,
    margin,
    orientation,
    precision,
    seed,
    units,
    width,
  }
}

/** Get the inner dimensions of a `settings`. */
export function innerDimensions(settings: Settings): [number, number] {
  return [settings.width, settings.height]
}

/** Get the outer dimensions of a `settings`. */
export function outerDimensions(settings: Settings): [number, number] {
  let { width, height, margin } = settings
  return [width + margin[1] + margin[3], height + margin[0] + margin[2]]
}

/** Get the output dimensions of a `settings` in pixels. */
export function outputDimensions(settings: Settings): [number, number] {
  let [outerWidth, outerHeight] = outerDimensions(settings)
  let { units } = settings
  let w = Math.convert(outerWidth, units, { to: 'px', precision: 1, dpi: 72 })
  let h = Math.convert(outerHeight, units, {
    to: 'px',
    precision: 1,
    dpi: 72,
  })
  return [w, h]
}

/** Get the screen dimensions of a `settings` in device-specific pixels. */
export function screenDimensions(settings: Settings): [number, number] {
  let [outputWidth, outputHeight] = outputDimensions(settings)
  let dpr = window.devicePixelRatio
  let w = outputWidth * dpr
  let h = outputHeight * dpr
  return [w, h]
}
