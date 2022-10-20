import { UnitsSystem, Units } from '..'

/** A constant to convert from inches to meters to change unit systems. */
const IN_TO_M = 0.0254

/** Conversions for units within their respective system. */
const CONVERSIONS: Record<Exclude<Units, 'px'>, [UnitsSystem, number]> = {
  m: ['metric', 1],
  cm: ['metric', 1 / 100],
  mm: ['metric', 1 / 1000],
  in: ['imperial', 1],
  ft: ['imperial', 12],
  pc: ['imperial', 1 / 6],
  pt: ['imperial', 1 / 72],
}

/** Convert a `value` in `units` to the sketch's default units. */
export function convert(
  value: number,
  from: Units,
  options: {
    to?: Units
    dpi?: number
    precision?: number
  } = {}
): number {
  let { scene } = Void
  let { to = scene?.units ?? 'px', dpi = scene?.dpi ?? 72, precision } = options
  if (from === to) return value

  // Swap pixels for inches using the dynamic `dpi`.
  let factor = 1
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
  if (precision != null) result = Math.round(value / precision) * precision
  return result
}
