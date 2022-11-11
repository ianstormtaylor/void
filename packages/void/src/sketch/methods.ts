import { Math, Units, OUTPUT_MIME_TYPES, Random, Config, Schema } from '..'
import { Frame, Handlers, Keyboard, Layer, Pointer, Sketch } from '.'
import {
  applyOrientation,
  createPrng,
  CSS_CPI,
  svgDataUriToString,
  svgElementToString,
  svgStringToDataUri,
  svgStringToElement,
  SVG_NAMESPACE,
} from '../utils'

/** Get the current sketch and assert one exists. */
export function assert(): Sketch {
  let sketch = current()
  if (!sketch) {
    throw new Error(
      `No active sketch! Make sure only call Void helpers inside a sketch function!`
    )
  }
  return sketch
}

/** Attach the sketch to the DOM. */
export function attach(sketch: Sketch): void {
  let { container, el } = sketch
  let [width, height] = dimensions(sketch, 'pixel')
  container.style.position = 'relative'
  el.style.position = 'absolute'
  el.style.width = `${width}px`
  el.style.height = `${height}px`
  el.style.top = '50%'
  el.style.left = '50%'
  el.style.margin = `${-height / 2}px 0 0 ${-width / 2}px`
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
  if (el.parentNode === container) container.removeChild(el)
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
      ? CSS_CPI
      : mode === 'device'
      ? CSS_CPI * window.devicePixelRatio
      : settings.dpi
  let w = width + left + right
  let h = height + top + bottom
  let x = Math.convert(w, units, to, { dpi, precision })
  let y = Math.convert(h, units, to, { dpi, precision })
  return [x, y]
}

/** Emit an `event` to all the sketch's handlers. */
export function emit<T extends keyof Handlers>(
  sketch: Sketch,
  event: T,
  ...args: Parameters<Handlers[T][number]>
): void {
  for (let callback of sketch.handlers?.[event] ?? []) {
    callback(...(args as [any]))
  }
}

/** Execute a `fn` with the sketch loaded on the global `VOID` context. */
export function exec(sketch: Sketch, fn: () => void) {
  let prng = (sketch.prng ??= createPrng(sketch.seed))
  let unseed = Random.seed(prng)
  let VOID = (globalThis.VOID ??= {})
  let prev = VOID.sketch
  VOID.sketch = sketch
  try {
    fn()
  } catch (e) {
    Sketch.emit(sketch, 'error', e as Error)
  } finally {
    VOID.sketch = prev
    unseed()
  }
}

/** Get the sketch's current frame information. */
export function frame(sketch: Sketch): Frame {
  return (sketch.frame ??= {
    count: -1,
    time: window.performance.now(),
    rate: sketch.settings.fps,
  })
}

/** Get the sketch's current keyboard information. */
export function keyboard(sketch: Sketch): Keyboard {
  return (sketch.keyboard ??= {
    key: null,
    keys: {},
    code: null,
    codes: {},
  })
}

/** Create a new layer with `name`. */
export function layer(sketch: Sketch, name?: string): Layer {
  if (!name) {
    let { length } = Object.keys(sketch.layers)
    while ((name = `Layer ${++length}`) in sketch.layers) {}
  }

  // Delete and reassign existing layers to preserve the sketch's layer order.
  let layer: Layer = sketch.layers[name] ?? { hidden: false }
  if (name in sketch.layers) delete sketch.layers[name]
  sketch.layers[name] = layer
  return layer
}

/** Create a sketch from a `construct` function, with optional `el` and `overrides`. */
export function of(attrs: {
  construct: () => void
  container: HTMLElement
  hash: string
  layers?: Sketch['layers']
  config?: Sketch['config']
  traits?: Sketch['traits']
  output?: Sketch['output']
}): Sketch {
  let {
    construct,
    container,
    hash,
    output = { type: 'png' },
    config = {},
    layers = {},
    traits = {},
  } = attrs

  let seed = Number(hash)
  if (isNaN(seed)) {
    throw new Error(`Unable to parse hexadecimal hash: "${hash}"`)
  }

  return {
    config,
    construct,
    container,
    el: document.createElement('div'),
    hash,
    layers,
    output,
    seed,
    settings: {
      dpi: CSS_CPI,
      fps: 60,
      frames: Infinity,
      height: container.offsetHeight,
      margin: [0, 0, 0, 0],
      precision: 1,
      units: 'px',
      width: container.offsetWidth,
    },
    traits,
  }
}

/** Attach a `callback` to when an `event` is emitted. */
export function on<T extends keyof Handlers>(
  sketch: Sketch,
  event: T,
  callback: Handlers[T][number]
): void {
  sketch.handlers ??= {
    construct: [],
    draw: [],
    error: [],
    play: [],
    pause: [],
    stop: [],
  }
  sketch.handlers[event].push(callback as any)
}

/** Play the sketch's draw loop. */
export function play(sketch: Sketch) {
  if (sketch.raf) return
  if (sketch.status === 'stopped') return

  let { status, settings } = sketch
  let frame = Sketch.frame(sketch)

  if (status !== 'playing') {
    sketch.status = 'playing'
    Sketch.emit(sketch, 'play')
  }

  if (status == null) {
    Sketch.exec(sketch, sketch.construct)
    Sketch.emit(sketch, 'construct')
    Sketch.attach(sketch)
  }

  if (!sketch.draw || frame.count >= settings.frames) {
    Sketch.stop(sketch)
    return
  }

  let target = 1000 / settings.fps
  let now = window.performance.now()
  let delta = frame.count < 0 ? target : now - frame.time
  let epsilon = 5
  if (delta >= target - epsilon) {
    frame.count++
    frame.time = now
    frame.rate = 1000 / delta
    Sketch.exec(sketch, sketch.draw)
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

/** Get the sketch's current pointer information. */
export function pointer(sketch: Sketch): Pointer {
  return (sketch.pointer ??= {
    type: null,
    x: null,
    y: null,
    position: null,
    button: null,
    buttons: {},
  })
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
    Object.values(sketch.layers)
      .filter((layer) => layer.export != null)
      .map((layer) => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          let img = new Image()
          let url = layer.export!()
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
    if (!layer.export) continue
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

/** Resolve a `config` object into the sketch's settings. */
export function settings(sketch: Sketch, config: Config): Sketch['settings'] {
  config = { ...config, ...sketch.config }
  let { dpi = CSS_CPI, fps = 60, frames = Infinity } = config
  let orientation = Config.orientation(config)
  let units = Config.units(config)

  // Convert the precision to the sketch's units.
  let [precision, pu] = Config.precision(config)
  precision = Math.convert(precision, pu, units, { dpi })

  // Create a unit conversion helper with the sketch's default units.
  let [width, height, du] = Config.dimensions(config)
  if (width === Infinity) width = sketch.container.offsetWidth
  if (height === Infinity) height = sketch.container.offsetHeight
  width = Math.convert(width, du, units, { precision, dpi })
  height = Math.convert(height, du, units, { precision, dpi })

  // Apply the orientation setting to the dimensions.
  if (orientation != null) {
    ;[width, height] = applyOrientation(width, height, orientation)
  }

  // Apply a margin, so the canvas is drawn without need to know it.
  let [mt, mr, mb, ml, mu] = Config.margin(config)
  mt = Math.convert(mt, mu, units, { precision, dpi })
  mr = Math.convert(mr, mu, units, { precision, dpi })
  mb = Math.convert(mb, mu, units, { precision, dpi })
  ml = Math.convert(ml, mu, units, { precision, dpi })
  width -= mr + ml
  height -= mt + mb
  let margin = [mt, mr, mb, ml] as [number, number, number, number]

  sketch.config = config
  sketch.settings = {
    dpi,
    fps,
    frames,
    height,
    margin,
    precision,
    units,
    width,
  }
  return sketch.settings
}

/** Stop the sketch's draw loop. */
export function stop(sketch: Sketch) {
  if (sketch.status === 'stopped') return
  if (sketch.raf) window.cancelAnimationFrame(sketch.raf)
  delete sketch.raf
  sketch.status = 'stopped'
  Sketch.emit(sketch, 'stop')
}

/** Set a trait on a `sketch` to a new value. */
export function trait(
  sketch: Sketch,
  name: string,
  value: any,
  schema: Schema
): void {
  sketch.schemas ??= {}
  sketch.traits[name] = value
  sketch.schemas[name] = schema
}
