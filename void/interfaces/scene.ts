import { convert, Orientation, Units, ResolvedSettings } from '..'

export type Scene = {
  dpi: number
  height: number
  margin: [number, number, number, number]
  orientation: Orientation
  precision: number
  seed: number
  units: Units
  width: number
}

export let Scene = {
  /** Create a scene from fully resolved `settings`. */
  create(settings: ResolvedSettings): Scene {
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

    return {
      dpi,
      height,
      margin,
      orientation,
      precision,
      seed,
      units,
      width,
    }
  },

  /** Get the inner dimensions of a `scene`. */
  innerDimensions(scene: Scene): [number, number] {
    return [scene.width, scene.height]
  },

  /** Get the outer dimensions of a `scene`. */
  outerDimensions(scene: Scene): [number, number] {
    let { width, height, margin } = scene
    return [width + margin[1] + margin[3], height + margin[0] + margin[2]]
  },

  /** Get the output dimensions of a `scene` in pixels. */
  outputDimensions(scene: Scene): [number, number] {
    let [outerWidth, outerHeight] = Scene.outerDimensions(scene)
    let { units } = scene
    let w = convert(outerWidth, units, { to: 'px', precision: 1, dpi: 72 })
    let h = convert(outerHeight, units, { to: 'px', precision: 1, dpi: 72 })
    return [w, h]
  },

  /** Get the screen dimensions of a `scene` in device-specific pixels. */
  screenDimensions(scene: Scene): [number, number] {
    let [outputWidth, outputHeight] = Scene.outputDimensions(scene)
    let dpr = window.devicePixelRatio
    let w = outputWidth * dpr
    let h = outputHeight * dpr
    return [w, h]
  },
}
