import { Sketch } from '.'
import { MIME_TYPES } from '../interfaces/export'
import { Settings } from '../interfaces/settings'
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

/** Run the sketch's draw loop. */
export function loop(sketch: Sketch) {
  if (!sketch.state) return
  if (sketch.state.status === 'playing') return
  let { state } = sketch
  let { frame, settings } = state
  let fps = settings?.fps ?? 60
  let frames = sketch.draw ? settings?.frames ?? Infinity : -1

  if (state.status !== 'playing') {
    state.status = 'playing'
    Sketch.emit(sketch, 'play')
  }

  if (frame.count >= frames) {
    Sketch.stop(sketch)
    return
  }

  if (sketch.draw) {
    let { draw } = sketch
    let now = window.performance.now()
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

    state.raf = window.requestAnimationFrame(() => Sketch.loop(sketch))
  }
}

/** Create a sketch from a `construct` function, with optional `el` and `overrides`. */
export function of(
  construct: () => void,
  el: HTMLElement = document.body,
  overrides: Sketch['overrides'] = {}
): Sketch {
  let sketch: Sketch = {
    construct,
    el,
    overrides,
    handlers: { construct: [], draw: [], play: [], pause: [], stop: [] },
  }

  return sketch
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
  if (sketch.state?.status === 'playing') return
  if (sketch.state && !sketch.draw) return
  if (!sketch.state) {
    sketch.state = {
      status: 'stopped',
      exporting: sketch.overrides.exporting,
      traits: {},
      schema: {},
      layers: {},
      frame: {
        count: -1,
        time: window.performance.now(),
        rate: 0,
      },
    }

    Sketch.exec(sketch, sketch.construct)
    Sketch.emit(sketch, 'construct')
  }

  Sketch.loop(sketch)
}

/** Pause the sketch's draw loop. */
export function pause(sketch: Sketch) {
  if (!sketch.state) return
  if (sketch.state.raf) window.cancelAnimationFrame(sketch.state.raf)
  sketch.state.status = 'paused'
  Sketch.emit(sketch, 'pause')
}

/** Save the sketch's layers as an image. */
export async function save(sketch: Sketch): Promise<string> {
  if (!sketch?.state?.exporting) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  let { exporting } = sketch.state
  switch (exporting.type) {
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
  if (!sketch?.state?.exporting) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  if (!sketch?.state?.settings) {
    throw new Error(`Cannot export a sketch that hasn't run yet!`)
  }

  let { state } = sketch
  let { settings, exporting } = sketch.state
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
    Object.entries(state.layers).map(([name, getDataUrl]) => {
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

  let { type, quality } = exporting
  let mime = MIME_TYPES[type]
  let url = canvas.toDataURL(mime, quality)
  return url
}

export async function saveSvg(sketch: Sketch): Promise<string> {
  if (!sketch?.state?.exporting) {
    throw new Error(`Cannot save a sketch that wasn't initialized for export!`)
  }

  let { state } = sketch
  let svg = document.createElementNS(SVG_NAMESPACE, 'svg') as SVGSVGElement

  for (let [name, getDataUrl] of Object.entries(state.layers)) {
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

/** Stop the sketch's draw loop. */
export function stop(sketch: Sketch) {
  if (!sketch.state) return
  if (sketch.state.raf) window.cancelAnimationFrame(sketch.state.raf)
  sketch.state.status = 'stopped'
  Sketch.emit(sketch, 'stop')
}
