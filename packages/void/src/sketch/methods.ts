import { Sketch } from '.'
import { MIME_TYPES, Output } from '../interfaces/export'
import { Settings } from '../settings'
import {
  svgDataUriToString,
  svgElementToString,
  svgStringToDataUri,
  svgStringToElement,
  SVG_NAMESPACE,
} from '../utils'

/** Get the current sketch from the global `VOID` context. */
export function current(): Sketch | undefined {
  return globalThis.VOID?.sketch
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
export function of(
  construct: () => void,
  options: {
    el?: HTMLElement
    overrides?: Sketch['overrides']
    output?: Output
  } = {}
): Sketch {
  let { el = document.body, overrides = {}, output } = options
  let { offsetHeight: h, offsetWidth: w } = el
  return {
    config: {},
    construct,
    el,
    handlers: { construct: [], draw: [], play: [], pause: [], stop: [] },
    layers: {},
    output,
    overrides,
    schema: {},
    settings: {
      dpi: 72,
      fps: 60,
      frames: Infinity,
      height: h,
      margin: [0, 0, 0, 0],
      orientation: w === h ? 'square' : w > h ? 'landscape' : 'portrait',
      precision: 1,
      seed: 0,
      units: 'px',
      width: w,
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
    sketch.schema = {}
    sketch.traits = {}
    Sketch.exec(sketch, sketch.construct)
    Sketch.emit(sketch, 'construct')
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
  if (!sketch.output) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  let { settings, output } = sketch
  let canvas = document.createElement('canvas')
  let [screenWidth, screenHeight] = Settings.screenDimensions(settings)
  let [outputWidth, outputHeight] = Settings.outputDimensions(settings)
  canvas.width = screenWidth
  canvas.height = screenHeight
  canvas.style.width = `${outputWidth}px`
  canvas.style.height = `${outputHeight}px`

  let context = canvas.getContext('2d')
  if (!context) {
    throw new Error(`Cannot get a 2D context for a canvas!`)
  }

  let images = await Promise.all(
    Object.entries(sketch.layers).map(([name, getDataUrl]) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        let img = new Image()
        let url = getDataUrl()
        img.onload = () => resolve(img)
        img.onerror = (e, source, lineno, colno, error) => reject(error)
        img.src = url
      })
    })
  )

  for (let image of images) {
    context.drawImage(image, 0, 0)
  }

  let { type, quality } = output
  let mime = MIME_TYPES[type]
  let url = canvas.toDataURL(mime, quality)
  return url
}

export async function saveSvg(sketch: Sketch): Promise<string> {
  if (!sketch.output) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  let svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGSVGElement

  for (let [name, getDataUrl] of Object.entries(sketch.layers)) {
    let url = getDataUrl()
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
