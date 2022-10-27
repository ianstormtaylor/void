import { Orientation, Units, Config, Math } from '..'

/** The core settings needed to run a sketch. */
export type Settings = {
  dpi: number
  fps: number
  height: number
  margin: [number, number, number, number]
  orientation: Orientation
  precision: number
  seed: number
  units: Units
  width: number
}

export let Settings = {
  /** Create a settings object from fully resolved `config`. */
  create(config: Config): Settings {
    let { dpi, fps, seed, orientation, units } = config
    let to = units

    // Convert the precision to the sketch's units.
    let [precision, pu] = config.precision
    precision = Math.convert(precision, pu, { to, dpi })

    // Create a unit conversion helper with the sketch's default units.
    let [width, height, du] = config.dimensions
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

    // Apply a margin, so the canvas is drawn without knowing it.
    let [mt, mr, mb, ml, mu] = config.margin
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
      height,
      margin,
      orientation,
      precision,
      seed,
      units,
      width,
    }
  },

  /** Get the inner dimensions of a `settings`. */
  innerDimensions(settings: Settings): [number, number] {
    return [settings.width, settings.height]
  },

  /** Get the outer dimensions of a `settings`. */
  outerDimensions(settings: Settings): [number, number] {
    let { width, height, margin } = settings
    return [width + margin[1] + margin[3], height + margin[0] + margin[2]]
  },

  /** Get the output dimensions of a `settings` in pixels. */
  outputDimensions(settings: Settings): [number, number] {
    let [outerWidth, outerHeight] = Settings.outerDimensions(settings)
    let { units } = settings
    let w = Math.convert(outerWidth, units, { to: 'px', precision: 1, dpi: 72 })
    let h = Math.convert(outerHeight, units, {
      to: 'px',
      precision: 1,
      dpi: 72,
    })
    return [w, h]
  },

  /** Get the screen dimensions of a `settings` in device-specific pixels. */
  screenDimensions(settings: Settings): [number, number] {
    let [outputWidth, outputHeight] = Settings.outputDimensions(settings)
    let dpr = window.devicePixelRatio
    let w = outputWidth * dpr
    let h = outputHeight * dpr
    return [w, h]
  },
}
