import { Orientation, Units, UnitsSystem } from '.'

/** The SVG namespace string. */
export const SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/** The prefix for Base64-encoded SVG data URIs. */
export const SVG_DATA_URI_PREFIX = 'data:image/svg+xml;base64,'

/** The fixed DPI that CSS uses when displaying real-world units. */
export const CSS_DPI = 96

/** Convert an SVG string to a data URI. */
export function svgStringToDataUri(svg: string): string {
  const base64 = btoa(svg)
  const uri = `${SVG_DATA_URI_PREFIX}${base64}`
  return uri
}

/** Convert an SVG data URI to an SVG string. */
export function svgDataUriToString(uri: string): string {
  const base64 = uri.replace(SVG_DATA_URI_PREFIX, '')
  const string = atob(base64)
  return string
}

/** Convert an SVG string to an SVG element. */
export function svgStringToElement(string: string): SVGSVGElement {
  const div = document.createElement('div')
  div.innerHTML = string
  const el = div.firstChild as SVGSVGElement
  return el
}

/** Convert an SVG element to an SVG string. */
export function svgElementToString(el: SVGSVGElement): string {
  const div = document.createElement('div')
  div.appendChild(el)
  const string = div.innerHTML
  return string
}

/** Apply an `orientation` to a `width` and `height`. */
export function applyOrientation(
  width: number,
  height: number,
  orientation: Orientation
): [number, number] {
  if (orientation === 'square' && width != height) {
    width = height = Math.min(width, height)
  } else if (orientation === 'landscape' && width < height) {
    ;[width, height] = [height, width]
  } else if (orientation === 'portrait' && height < width) {
    ;[width, height] = [height, width]
  }
  return [width, height]
}

/** Resolve the orientation of a `width` and `height`. */
export function resolveOrientation(width: number, height: number): Orientation {
  return width === height ? 'square' : width < height ? 'portrait' : 'landscape'
}

/** A pseudo-random number generator using the SFC32 algorithm. */
export function Sfc32(
  a: number,
  b: number,
  c: number,
  d: number
): () => number {
  return () => {
    a |= 0
    b |= 0
    c |= 0
    d |= 0
    let t = (((a + b) | 0) + d) | 0
    d = (d + 1) | 0
    a = b ^ (b >>> 9)
    b = (c + (c << 3)) | 0
    c = (c << 21) | (c >>> 11)
    c = (c + t) | 0
    return t >>> 0
  }
}

/** The number of inches in a meter. */
const M_PER_INCH = 0.0254

/** The number of meters in an inch. */
const INCH_PER_M = 1 / M_PER_INCH

/** Conversions for units within their respective system. */
const CONVERSIONS: Record<Exclude<Units, 'px'>, [UnitsSystem, number]> = {
  m: ['metric', 1],
  cm: ['metric', 1 / 100],
  mm: ['metric', 1 / 1000],
  in: ['imperial', 1],
  ft: ['imperial', 12],
  yd: ['imperial', 36],
  pc: ['imperial', 1 / 6],
  pt: ['imperial', 1 / 72],
}

/** Convert a `value` from one unit to another. */
export function convertUnits(
  value: number,
  from: Units,
  to: Units,
  options: { dpi?: number; precision?: number } = {}
): number {
  if (from === to) return value
  const { dpi = CSS_DPI, precision } = options

  // Swap pixels for inches using the dynamic `dpi`.
  let factor = 1
  if (from === 'px') (factor /= dpi), (from = 'in')
  if (to === 'px') (factor *= dpi), (to = 'in')

  // Swap systems if `from` and `to` aren't using the same one.
  const [inSystem, inFactor] = CONVERSIONS[from]
  const [outSystem, outFactor] = CONVERSIONS[to]
  factor *= inFactor
  factor /= outFactor
  if (inSystem !== outSystem) {
    factor *= inSystem === 'metric' ? INCH_PER_M : M_PER_INCH
  }

  // Calculate the result and optionally truncate to a fixed number of digits.
  let result = value * factor
  if (precision != null && precision !== 0) {
    const p = 1 / precision
    result = Math.trunc(result * p) / p
  }

  return result
}
