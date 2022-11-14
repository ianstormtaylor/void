import { Context } from 'svgcanvas'
import { svgStringToDataUri } from './utils'
import {
  Sketch,
  Config,
  Random,
  Narrowable,
  Pointer,
  Keyboard,
  Math,
  Nameify,
  Nameable,
} from '.'

// A reference to whether the keyboard event listeners have been attached.
let KEYBOARD_EVENTS: WeakMap<Sketch, true> = new WeakMap()

// A reference to whether the pointer event listeners have been attached.
let POINTER_EVENTS: WeakMap<Sketch, true> = new WeakMap()

/**
 * Defines a boolean trait.
 *
 * If you pass an `initial` value, it will always be used as the default value
 * for the trait in a sketch, until overriden.
 *
 * Other, when randomly generated, you can pass a `probability` which is the
 * chance that the boolean will be `true`.
 */

export function bool(name: string, probability?: number): boolean
export function bool(name: string, initial: boolean): boolean
export function bool(name: string, options?: boolean | number): boolean {
  let sketch = Sketch.assert()
  let probability = typeof options === 'number' ? options : 0.5
  let initial = typeof options === 'boolean' ? options : undefined
  let value = Random.bool(probability)
  let { traits } = sketch
  if (name in traits && typeof traits[name] === 'boolean') {
    value = traits[name]
  } else if (initial != null) {
    value = initial
  }

  Sketch.trait(sketch, name, value, { type: 'boolean', probability, initial })
  return value
}

/**
 * Define a `draw` function with the drawing logic to render each frame of an
 * animated sketch.
 */

export function draw(fn: () => void) {
  let sketch = Sketch.assert()
  sketch.draw = fn
}

/**
 * Attach an event listener to the canvas.
 */

export function event<E extends keyof GlobalEventHandlersEventMap>(
  event: E,
  callback: (e: GlobalEventHandlersEventMap[E]) => void
): () => void {
  let sketch = Sketch.assert()
  let { el } = sketch
  let fn = (e: GlobalEventHandlersEventMap[E]) => {
    Sketch.exec(sketch, () => callback(e))
  }

  el.addEventListener(event, fn)
  let off = () => el.removeEventListener(event, fn)
  Sketch.on(sketch, 'stop', off)
  return off
}

/**
 * Define a floating point trait.
 *
 * You can either pass a single `initial` argument which will be used as the
 * default value. Or you can pass a `min`, `max`, and optional `step` and the
 * trait will be randomly generated.
 */

export function float(name: string, initial: number): number
export function float(
  name: string,
  min: number,
  max: number,
  step?: number
): number
export function float(
  name: string,
  min: number,
  max?: number,
  step?: number
): number {
  let sketch = Sketch.assert()
  let initial
  if (max == null) {
    initial = min
    min = Number.MIN_VALUE
    max = Number.MAX_VALUE
  }

  let value = Random.float(min, max, step)
  let { traits } = sketch
  if (name in traits && typeof traits[name] === 'number') {
    value = traits[name]
  } else if (initial != null) {
    value = initial
  }

  Sketch.trait(sketch, name, value, { type: 'float', min, max, step, initial })
  return value
}

/**
 * Define an integer trait.
 *
 * You can either pass a single `initial` argument which will be used as the
 * default value. Or you can pass a `min`, `max`, and optional `step` and the
 * trait will be randomly generated.
 */

export function int(name: string, initial: number): number
export function int(
  name: string,
  min: number,
  max: number,
  step?: number
): number
export function int(name: string, min: number, max?: number, step = 1): number {
  let sketch = Sketch.assert()
  let initial
  if (max == null) {
    initial = min
    min = Number.MIN_SAFE_INTEGER
    max = Number.MAX_SAFE_INTEGER
  }

  let value = Random.int(min, max, step)
  let { traits } = sketch
  if (name in traits && typeof traits[name] === 'number') {
    value = traits[name]
  } else if (initial != null) {
    value = initial
  }

  Sketch.trait(sketch, name, value, { type: 'int', min, max, step, initial })
  return value
}

/**
 * Get a reference to the current keyboard data.
 *
 * The returned object is mutable and will continue to stay up to date as keys
 * are pressed down and lifted up.
 */

export function keyboard(): Keyboard {
  let sketch = Sketch.assert()
  let keyboard = Sketch.keyboard(sketch)

  if (!KEYBOARD_EVENTS.has(sketch)) {
    event('keydown', (e) => {
      keyboard.code = e.code
      keyboard.key = e.key
      keyboard.codes[e.code] = true
      keyboard.keys[e.key] = true
    })

    event('keyup', (e) => {
      keyboard.code = null
      keyboard.key = null
      delete keyboard.codes[e.code]
      delete keyboard.keys[e.key]
    })

    KEYBOARD_EVENTS.set(sketch, true)
  }

  return keyboard
}

/**
 * Get a new canvas layer to draw on, placed above all other layers.
 *
 * If the `name` argument is omitted it will be auto-generated.
 */

export function layer(name?: string): CanvasRenderingContext2D {
  let sketch = Sketch.assert()
  let { settings, output, el } = sketch
  let { width, height, margin, units } = settings
  let canvas = document.createElement('canvas')
  let vector = output.type === 'svg' || output.type === 'pdf'
  let ctx = vector
    ? new Context(`${width}${units}`, `${height}${units}`)
    : canvas.getContext('2d')
  if (!ctx) {
    throw new Error(`Unable to get 2D rendering context from canvas!`)
  }

  let [top, , , left] = margin
  let [totalWidth, totalHeight] = Sketch.dimensions(sketch)
  let [pixelWidth, pixelHeight] = Sketch.dimensions(sketch, 'pixel')
  let [deviceWidth, deviceHeight] = Sketch.dimensions(sketch, 'device')
  let layer = Sketch.layer(sketch, name)
  canvas.width = deviceWidth
  canvas.height = deviceHeight
  canvas.style.position = 'absolute'
  canvas.style.display = layer.hidden ? 'none' : 'block'
  canvas.style.width = `${pixelWidth}px`
  canvas.style.height = `${pixelHeight}px`
  el.appendChild(canvas)
  ctx.scale(deviceWidth / totalWidth, deviceHeight / totalHeight)
  ctx.translate(top, left)
  layer.export = () => {
    return vector
      ? svgStringToDataUri(ctx.getSerializedSvg())
      : canvas.toDataURL('image/png')
  }

  return ctx
}

/**
 * Get a reference to the current pointer (eg. mouse, pen, finger) data.
 *
 * The returned object is mutable and will continue to stay up to date as the
 * viewer clicks, taps, or hovers.
 *
 * Note that the pointer only refers to the "primary" pointer, and to handle
 * multi-touch scenarios you'll need to attach your own event handlers with the
 * `Void.event()` method instead.
 */

export function pointer(): Pointer {
  let sketch = Sketch.assert()
  let pointer = Sketch.pointer(sketch)

  if (!POINTER_EVENTS.has(sketch)) {
    event('pointermove', (e) => {
      if (!e.isPrimary) return
      let { el } = sketch
      let canvas = el.querySelector('canvas')
      if (!canvas) return
      pointer.type = e.pointerType as 'mouse' | 'pen' | 'touch'
      pointer.position ??= [] as any
      pointer.x = pointer.position![0] = Math.convert(e.offsetX, 'px')
      pointer.y = pointer.position![1] = Math.convert(e.offsetY, 'px')
    })

    event('pointerleave', (e) => {
      if (!e.isPrimary) return
      pointer.x = null
      pointer.y = null
      pointer.position = null
    })

    event('pointerdown', (e) => {
      if (!e.isPrimary) return
      pointer.button = e.button
      pointer.buttons[e.button] = true
    })

    event('pointerup', (e) => {
      if (!e.isPrimary) return
      pointer.button = null
      delete pointer.buttons[e.button]
    })

    POINTER_EVENTS.set(sketch, true)
  }

  return pointer
}

/**
 * Define a trait that picks one of many `choices`.
 *
 * You may pass an `initial` value as the second argument. Otherwise, the choice
 * will be randomly picked for you.
 *
 * The choices may either be an array or object of values. For weighted choices,
 * the array or object values should be a tuple, where the first element is a
 * number representing the weight.
 */

export function pick<V extends Narrowable>(name: string, choices: Choices<V>): V
export function pick<V>(name: string, choices: Choices<V>): V
export function pick<V extends Narrowable>(
  name: string,
  initial: Nameify<V>,
  choices: Choices<V>
): V
export function pick<V>(
  name: string,
  initial: Nameify<V>,
  choices: Choices<V>
): V
export function pick<V>(
  name: string,
  initial: Nameify<V> | Choices<V> | undefined,
  choices?: Choices<V>
): V {
  if (choices == null) (choices = initial as Choices<V>), (initial = undefined)
  let sketch = Sketch.assert()
  let { names, weights, mapping } = normalizeChoices(choices!)
  let value = Random.pick(names, weights)
  let { traits } = sketch

  if (name in traits && traits[name] in mapping) {
    value = traits[name]
  } else if (initial !== undefined) {
    value = String(initial) // allow booleans, numbers, etc. to be real
  }

  Sketch.trait(sketch, name, value, { type: 'pick', names, weights })
  return mapping[value]
}

/**
 * Setup the layout and scene for a sketch.
 *
 * This method returns an object of all the resolved settings of a sketch,
 * including the resolved `width` and `height` of the canvas.
 */

export function settings(): Sketch['settings']
export function settings(config: Config): Sketch['settings']
export function settings(dimensions: Config['dimensions']): Sketch['settings']
export function settings(
  config?: Config | Config['dimensions']
): Sketch['settings'] {
  if (typeof config === 'string' || Array.isArray(config)) {
    config = { dimensions: config }
  }

  let sketch = Sketch.assert()
  let settings = Sketch.settings(sketch, config ?? {})
  return settings
}

// The shorthand for define a set of choices.
type Choices<V> = V extends Nameable
  ?
      | readonly V[]
      | readonly [number, V][]
      | Record<string, V>
      | Record<string, [number, V]>
  :
      | Exclude<readonly V[], readonly any[][]>
      | readonly [number, V][]
      | Record<string, Exclude<V, any[]>>
      | Record<string, [number, V]>

// Normalize the shorthand for defining choices into schema objects.
function normalizeChoices<V>(shorthand: Choices<V>): {
  names: string[]
  weights: number[]
  mapping: Record<string, V>
} {
  let names: string[] = []
  let weights: number[] = []
  let mapping: Record<string, V> = {}
  let entries = Array.isArray(shorthand)
    ? shorthand.entries()
    : Object.entries(shorthand)

  for (let [i, v] of entries) {
    let [weight, value] = Array.isArray(v) ? v : [1, v]
    let name = typeof i === 'number' ? String(value) : i
    names.push(name)
    weights.push(weight)
    mapping[name] = value
  }

  return { names, weights, mapping }
}
