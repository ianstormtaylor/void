import { Math, Units, OUTPUT_MIME_TYPES, Output } from '..'
import { Sketch } from '.'
import {
  HTML_CSS_DPI,
  svgDataUriToString,
  svgElementToString,
  svgStringToDataUri,
  svgStringToElement,
  SVG_NAMESPACE,
} from '../utils'

/** Attach the sketch to the DOM. */
export function attach(sketch: Sketch): void {
  let { container, el } = sketch
  let [width, height] = dimensions(sketch, 'pixel')
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.position = 'relative'
  el.style.background = 'white'
  el.style.outline = '1px solid #e4e4e4'
  container.appendChild(el)
}

/** Get the current sketch from the global `VOID` context. */
export function current(): Sketch | undefined {
  return globalThis.VOID?.sketch
}

/** Detach the sketch from the DOM. */
export function detach(sketch: Sketch): void {
  let { container, el } = sketch
  stop(sketch)
  container.removeChild(el)
}

/** Get the full-sized dimensions of a `sketch`, including margins, in the sketch's own units. */
export function dimensions(
  sketch: Sketch,
  mode: 'sketch' | 'pixel' | 'device' = 'sketch'
): [number, number] {
  let { settings } = sketch
  let { width, height, margin, units } = settings
  let [top, right, bottom, left] = margin
  let precision = 1
  let to: Units = mode === 'sketch' ? settings.units : 'px'
  let dpi =
    mode === 'pixel'
      ? HTML_CSS_DPI
      : mode === 'device'
      ? HTML_CSS_DPI * window.devicePixelRatio
      : settings.dpi

  let w = width + left + right
  let h = height + top + bottom
  let x = Math.convert(w, units, to, { dpi, precision })
  let y = Math.convert(h, units, to, { dpi, precision })
  return [x, y]
}

/** Emit an `event` to all the sketch's handlers. */
export function emit(sketch: Sketch, event: keyof Sketch['handlers']): void {
  for (let callback of sketch.handlers[event]) {
    callback()
  }
}

/** Execute a `fn` with the sketch loaded on the global `VOID` context. */
export function exec(sketch: Sketch, fn: () => void) {
  let VOID = (globalThis.VOID ??= {})
  let prev = VOID.sketch
  VOID.sketch = sketch
  fn()
  VOID.sketch = prev
}

/** Create a sketch from a `construct` function, with optional `el` and `overrides`. */
export function of(attrs: {
  construct: () => void
  container?: HTMLElement
  el?: HTMLElement
  overrides?: Sketch['overrides']
  output?: Output
}): Sketch {
  let {
    construct,
    container = document.body,
    el = document.createElement('div'),
    overrides = {},
    output,
  } = attrs
  return {
    config: {},
    construct,
    container,
    el,
    handlers: { construct: [], draw: [], play: [], pause: [], stop: [] },
    layers: {},
    output: output ?? { type: 'png' },
    overrides,
    schemas: {},
    settings: {
      dpi: 72,
      fps: 60,
      frames: Infinity,
      height: container.offsetHeight,
      margin: [0, 0, 0, 0],
      precision: 1,
      seed: 0,
      units: 'px',
      width: container.offsetWidth,
    },
    status: 'stopped',
    traits: {},
  }
}

/** Attach a `callback` to when an `event` is emitted. */
export function on(
  sketch: Sketch,
  event: keyof Sketch['handlers'],
  callback: () => void
): void {
  sketch.handlers[event].push(callback)
}

/** Play the sketch's draw loop. */
export function play(sketch: Sketch) {
  if (sketch.raf) return
  if (sketch.status !== 'playing') {
    sketch.status = 'playing'
    Sketch.emit(sketch, 'play')
  }

  let now = window.performance.now()
  if (!sketch.frame) {
    sketch.config = {}
    sketch.frame = { count: -1, time: now, rate: 0 }
    sketch.layers = {}
    sketch.schemas = {}
    sketch.traits = {}
    Sketch.exec(sketch, sketch.construct)
    Sketch.emit(sketch, 'construct')
    Sketch.attach(sketch)
  }

  let { frame, settings } = sketch
  let { fps, frames } = settings
  if (!sketch.draw || frame.count >= frames) {
    Sketch.stop(sketch)
    return
  }

  let { draw } = sketch
  let delta = now - frame.time
  let target = 1000 / fps
  let epsilon = 5
  if (delta >= target - epsilon) {
    frame.time = now
    frame.count = frame.count + 1
    frame.rate = 1000 / delta
    Sketch.exec(sketch, () => draw(frame))
    Sketch.emit(sketch, 'draw')
  }

  sketch.raf = window.requestAnimationFrame(() => {
    delete sketch.raf
    Sketch.play(sketch)
  })
}

/** Pause the sketch's draw loop. */
export function pause(sketch: Sketch) {
  if (sketch.status !== 'playing') return
  if (sketch.raf) window.cancelAnimationFrame(sketch.raf)
  delete sketch.raf
  sketch.status = 'paused'
  Sketch.emit(sketch, 'pause')
}

/** Save the sketch's layers as an image. */
export async function save(sketch: Sketch): Promise<string> {
  if (!sketch.output) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  switch (sketch.output.type) {
    case 'png':
    case 'jpg':
    case 'webp':
      return await saveImage(sketch)
    case 'svg':
      return await saveSvg(sketch)
    case 'pdf':
      throw new Error('not implemented!')
  }
}

export async function saveImage(sketch: Sketch): Promise<string> {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')
  if (!context) {
    throw new Error(`Cannot get a 2D context for a canvas!`)
  }

  let [deviceWidth, deviceHeight] = Sketch.dimensions(sketch, 'device')
  let [pixelHeight, pixelWidth] = Sketch.dimensions(sketch, 'pixel')
  canvas.width = deviceWidth
  canvas.height = deviceHeight
  canvas.style.width = `${pixelHeight}px`
  canvas.style.height = `${pixelWidth}px`

  let images = await Promise.all(
    Object.values(sketch.layers).map((layer) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image()
        let url = layer.export()
        img.onload = () => resolve(img)
        img.onerror = (e, source, lineno, colno, error) => reject(error)
        img.src = url
      })
    })
  )

  for (let image of images) {
    context.drawImage(image, 0, 0)
  }

  let { output } = sketch
  let { type } = output
  let quality = 'quality' in output ? output.quality : 1
  let mime = OUTPUT_MIME_TYPES[type]
  let url = canvas.toDataURL(mime, quality)
  return url
}

export async function saveSvg(sketch: Sketch): Promise<string> {
  let svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGSVGElement

  for (let layer of Object.values(sketch.layers)) {
    let url = layer.export()
    let string = svgDataUriToString(url)
    let el = svgStringToElement(string)
    let group = document.createElementNS(SVG_NAMESPACE, 'g')
    svg.setAttribute('version', el.getAttribute('version')!)
    svg.setAttribute('xmlns', el.getAttribute('xmlns')!)
    svg.setAttribute('xmlns:xlink', el.getAttribute('xmlns:xlink')!)
    svg.setAttribute('width', el.getAttribute('width')!)
    svg.setAttribute('height', el.getAttribute('height')!)
    svg.appendChild(group)
    for (let node of Array.from(el.childNodes)) {
      group.appendChild(node)
    }
  }

  let string = svgElementToString(svg)
  let url = svgStringToDataUri(string)
  return url
}

// Code from before:
// import { jsPDF } from 'jspdf'
// export async function savePdf(sketch: Sketch): Promise<string> {
//   /** Export a vector PDF file from a `settings` and `module`. */
//   export let exportPdf = async (
//     module: Module,
//     settings: Settings,
//     traits: Traits
//   ) => {
//     let string = getSvg(module, settings, traits)
//     let div = document.createElement('div')
//     div.innerHTML = string
//     let el = div.firstChild as SVGSVGElement
//     let [width, height] = Settings.outerDimensions(settings)
//     let { units } = settings
//     let doc = new jsPDF({
//       unit: units as any,
//       format: [width, height],
//       hotfixes: ['px_scaling'],
//     })
//     await doc.svg(el, { width, height, x: 0, y: 0 })
//     doc.save('download.pdf')
//   }
// }

/** Stop the sketch's draw loop. */
export function stop(sketch: Sketch) {
  if (sketch.status === 'stopped') return
  if (sketch.raf) window.cancelAnimationFrame(sketch.raf)
  delete sketch.raf
  sketch.status = 'stopped'
  Sketch.emit(sketch, 'stop')
}
