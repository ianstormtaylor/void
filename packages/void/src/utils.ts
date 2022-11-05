import { Orientation } from '.'

/** The SVG namespace string. */
export let SVG_NAMESPACE = 'http://www.w3.org/2000/svg'

/** The prefix for Base64-encoded SVG data URIs. */
export let SVG_DATA_URI_PREFIX = 'data:image/svg+xml;base64,'

/** The fixed DPI that HTML/CSS use when displaying. */
export let HTML_CSS_DPI = 96

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

/** Resolve the orientation of a `width` and `height`. */
export function resolveOrientation(width: number, height: number): Orientation {
  return width === height ? 'square' : width < height ? 'portrait' : 'landscape'
}
