import { cloneDeep } from 'lodash'
import { Random } from './random'
import {
  DIMENSIONS,
  Dimensions,
  Paper,
  Orientation,
  System,
  Units,
  Margins,
} from './dimensions'
import { Control, Settings } from './settings'

/** A sketch object, with settings and helpers. */
export class State<T extends Record<string, any> = Record<string, any>> {
  readonly schema: Record<keyof T, Control>
  readonly dpi: number
  readonly dimensions: Dimensions
  readonly height: number
  readonly margin: Margins
  readonly margins: [number, number, number, number]
  readonly orientation: Orientation
  readonly paper: Paper | null
  readonly random: Random
  readonly seed: number
  readonly precision: number
  readonly units: Units
  readonly traits: T
  readonly width: number

  frame: number
  convert: (
    value: number,
    from: Units,
    options?: {
      to?: Units
      dpi?: number
      precision?: number
    }
  ) => number

  /** Create a new sketch with `Settings`. */
  constructor(settings: Settings<T>) {
    let {
      dimensions = [300, 150, 'px'],
      dpi = 72,
      margin,
      orientation,
      seed = 1,
      precision = 0,
      units,
    } = settings

    if (typeof dimensions === 'string') {
      this.paper = dimensions
      dimensions = DIMENSIONS[dimensions]
    } else {
      this.paper = null
    }

    this.dimensions = dimensions
    this.dpi = dpi
    this.precision = precision
    this.seed = seed
    this.frame = -1

    // Create a unit conversion helper with the sketch's default units.
    let [width, height, u] = dimensions
    ;[width, height, orientation] = applyOrientation(width, height, orientation)
    this.margin = margin ?? [0, u]
    this.units = units ?? getUnits(u)
    this.convert = createConvert(this.units, this.dpi)
    this.width = this.convert(width, u, { precision })
    this.height = this.convert(height, u, { precision })
    this.orientation = orientation

    // Apply a margin, so the canvas is drawn without knowing it.
    if (margin == null) {
      this.margins = [0, 0, 0, 0]
    } else {
      let [t, r, b, l, u] = normalizeMargin(margin)
      t = this.convert(t, u, { precision })
      r = this.convert(r, u, { precision })
      b = this.convert(b, u, { precision })
      l = this.convert(l, u, { precision })
      this.margins = [t, r, b, l]
      this.width -= r + l
      this.height -= t + b
    }

    // Create a set of seeded randomness helpers.
    this.random = new Random(seed)

    // Setup the sketch's variables and interface controls.
    this.traits = cloneDeep(settings.traits) ?? ({} as T)
    this.schema = getSchema(this.traits, settings.schema)
  }
}

/** Get the implicit schema from a set of `traits`. */
function getSchema<T extends Record<string, any>>(
  traits: T,
  controls?: Record<keyof T, Partial<Control>>
): Record<keyof T, Control> {
  let ret: Record<string, Control> = {}

  for (let [key, value] of Object.entries(traits)) {
    let { min, max, step, options } = (controls?.[key] ?? {}) as any

    if (typeof value === 'boolean') {
      ret[key] = { type: 'boolean' }
    } else if (typeof value === 'number') {
      ret[key] = {
        type: 'number',
        min: min ?? -Infinity,
        max: max ?? Infinity,
        step: step ?? getStep(value),
      }
    } else if (options != null) {
      ret[key] = {
        type: 'enum',
        options,
      }
    }
  }

  return ret as any
}

/** Get a default incrementing/decrementing amount for a varible of `value`. */
function getStep(value: number): number {
  let step = 0
  let abs = Math.abs(value)

  if (Number.isInteger(value)) {
    if (value % 1000 === 0 && abs >= 5000) step = 1000
    if (value % 500 === 0 && abs >= 2000) step = 500
    if (value % 100 === 0 && abs >= 600) step = 100
    if (value % 50 === 0 && abs >= 350) step = 50
    if (value % 25 === 0 && abs >= 175) step = 25
    if (value % 10 === 0 && abs >= 50) step = 10
    if (value % 5 === 0 && abs >= 25) step = 5
    else step = 1
  } else {
    if (value % 0.5 === 0 && abs >= 2.5) step = 0.5
    else if (value % 0.25 === 0 && abs >= 0.75) step = 0.25
    else if (value % 0.1 === 0 && abs >= 0.3) step = 0.1
    else if (value % 0.05 === 0 && abs >= 0.05) step = 0.05
    else step = 0.01
  }

  return step
}

/** Get the default canvas units for given `units`. */
function getUnits(units: Units): Units {
  switch (units) {
    case 'px':
      return 'px'
    case 'mm':
    case 'cm':
    case 'm':
      return 'mm'
    case 'pt':
    case 'pc':
    case 'in':
    case 'ft':
      return 'pt'
    default:
      let unhandled: never = units
      throw new Error(`Unhandled units: ${unhandled}`)
  }
}

/** Normalize a margin argument to include all sides. */
function normalizeMargin(
  margin: Margins
): [number, number, number, number, Units] {
  if (margin.length === 2) {
    let [m, u] = margin
    return [m, m, m, m, u]
  } else if (margin.length === 3) {
    let [v, h, u] = margin
    return [v, h, v, h, u]
  } else if (margin.length === 4) {
    let [t, h, b, u] = margin
    return [t, h, b, h, u]
  } else {
    return margin
  }
}

/** Apply an `orientation` to a `width` and `height`. */
function applyOrientation(
  width: number,
  height: number,
  ori: Orientation | undefined
): [number, number, Orientation] {
  if (ori == null) {
    ori =
      width === height ? 'square' : width < height ? 'portrait' : 'landscape'
    return [width, height, ori]
  }

  if (ori === 'square' && width != height) {
    let min = Math.min(width, height)
    return [min, min, ori]
  }

  if (
    (ori === 'landscape' && width < height) ||
    (ori === 'portrait' && height < width)
  ) {
    return [height, width, ori]
  }

  return [width, height, ori]
}

/** Conversions for units within their respective system. */
const CONVERSIONS: Record<Exclude<Units, 'px'>, [System, number]> = {
  m: ['metric', 1],
  cm: ['metric', 1 / 100],
  mm: ['metric', 1 / 1000],
  in: ['imperial', 1],
  ft: ['imperial', 12],
  pc: ['imperial', 1 / 6],
  pt: ['imperial', 1 / 72],
}

/** A constant to convert from inches to meters to change unit systems. */
const IN_TO_M = 0.0254

/** Convert a `value` in `units` to the sketch's units. */
function createConvert(defaultOutput: Units, defaultDpi: number) {
  return function convert(
    value: number,
    from: Units,
    options: {
      to?: Units
      dpi?: number
      precision?: number
    } = {}
  ): number {
    let { to = defaultOutput, dpi = defaultDpi, precision } = options
    let factor = 1
    if (from === to) return value

    // Swap pixels for inches using the dynamic `dpi`.
    if (from === 'px') (factor /= dpi), (from = 'in')
    if (to === 'px') (factor *= dpi), (to = 'in')

    // Swap systems if `from` and `to` aren't using the same one.
    let [inS, inF] = CONVERSIONS[from]
    let [outS, outF] = CONVERSIONS[to]
    factor *= inF
    factor /= outF
    if (inS !== outS) factor *= inS === 'metric' ? 1 / IN_TO_M : IN_TO_M

    // Calculate the result and optionally round to a fixed number of digits.
    let result = (value *= factor)
    if (precision != null) result = Number(result.toFixed(precision))
    return result
  }
}
