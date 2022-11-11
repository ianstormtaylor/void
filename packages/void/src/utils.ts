import { Orientation } from '.'

/** The SVG namespace string. */
export let SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/** The prefix for Base64-encoded SVG data URIs. */
export let SVG_DATA_URI_PREFIX = 'data:image/svg+xml;base64,'

/** The fixed DPI that CSS uses when displaying real-world units. */
export let CSS_CPI = 96

/** Convert an SVG string to a data URI. */
export function svgStringToDataUri(svg: string): string {
  let base64 = btoa(svg)
  let uri = `${SVG_DATA_URI_PREFIX}${base64}`
  return uri
}

/** Convert an SVG data URI to an SVG string. */
export function svgDataUriToString(uri: string): string {
  let base64 = uri.replace(SVG_DATA_URI_PREFIX, '')
  let string = atob(base64)
  return string
}

/** Convert an SVG string to an SVG element. */
export function svgStringToElement(string: string): SVGSVGElement {
  let div = document.createElement('div')
  div.innerHTML = string
  let el = div.firstChild as SVGSVGElement
  return el
}

/** Convert an SVG element to an SVG string. */
export function svgElementToString(el: SVGSVGElement): string {
  let div = document.createElement('div')
  div.appendChild(el)
  let string = div.innerHTML
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

/** Create a pseudo-random number generator using the PCG algorithm, with a `seed`. */
export function createPrng(seed: number): () => number {
  let state = seed | 0
  let random = () => {
    let next = (state >>> ((state >>> 28) + 4)) ^ state
    next = Math.imul(next, 277803737)
    next = (next >>> 22) ^ next
    state = Math.imul(state, 747796405) + 2891336453
    return (next >>> 0) / 4294967296
  }

  random()
  state = (state + seed) | 0
  random()
  return random
}
