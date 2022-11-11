import { Context } from 'svgcanvas'
import { svgStringToDataUri } from './utils'
import {
  Sketch,
  Schema,
  SchemaChoice,
  Config,
  Random,
  SchemaPick,
  SchemaSample,
  Narrowable,
  Pointer,
  Keyboard,
  Math,
} from '.'

/** Define a trait that is a boolean, with optional `probability` of being true. */
export function bool(name: string, probability = 0.5): boolean {
  let value = Random.bool(probability)
  return resolve(name, value, { type: 'boolean', probability })
}

/** Define a `draw` function that renders each frame. */
export function draw(fn: () => void) {
  let sketch = Sketch.assert()
  sketch.draw = fn
}

/** Attach an event listener to the canvas. */
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

/** Define a trait that is a floating point number, between `min` and `max`, with optional `step` to increment by. */
export function float(
  name: string,
  min: number,
  max: number,
  step?: number
): number {
  let value = Random.float(min, max, step)
  return resolve(name, value, { type: 'float', min, max, step })
}

/** Define a trait that is an integer, between `min` and `max`, with optional `step` to increment by. */
export function int(name: string, min: number, max: number, step = 1): number {
  let value = Random.int(min, max, step)
  return resolve(name, value, { type: 'int', min, max, step })
}

/** Get a reference to the current keyboard data. */
export function keyboard(): Keyboard {
  let sketch = Sketch.assert()
  let keyboard = Sketch.keyboard(sketch)

  if (!KEYBOARD_LISTENING.has(sketch)) {
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

    KEYBOARD_LISTENING.set(sketch, true)
  }

  return keyboard
}

let KEYBOARD_LISTENING: WeakMap<Sketch, true> = new WeakMap()

/** Get a canvas layer to draw with. */
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

/** Get a reference to the current pointer data. */
export function pointer(): Pointer {
  let sketch = Sketch.assert()
  let pointer = Sketch.pointer(sketch)

  if (!POINTER_LISTENING.has(sketch)) {
    event('pointermove', (e) => {
      if (!e.isPrimary) return
      let { el } = sketch
      let canvas = el.querySelector('canvas')
      if (!canvas) return
      pointer.type = e.pointerType as 'mouse' | 'pen' | 'touch'
      pointer.x = Math.convert(e.offsetX, 'px')
      pointer.y = Math.convert(e.offsetY, 'px')
      // pointer.x = (e.offsetX * canvas.width) / canvas.offsetWidth
      // pointer.y = (e.offsetY * canvas.height) / canvas.offsetHeight
      // let rect = sketch.el.getBoundingClientRect()
      // pointer.x = e.x - rect.left
      // pointer.y = e.y - rect.top
      if (pointer.point) {
        pointer.point[0] = pointer.x
        pointer.point[1] = pointer.y
      } else {
        pointer.point = [pointer.x, pointer.y]
      }
    })

    event('pointerleave', (e) => {
      if (!e.isPrimary) return
      pointer.x = null
      pointer.y = null
      pointer.point = null
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

    POINTER_LISTENING.set(sketch, true)
  }

  return pointer
}

let POINTER_LISTENING: WeakMap<Sketch, true> = new WeakMap()

/** Define a trait that picks one of many `choices`. */
export function pick<V extends Narrowable>(name: string, choices: Choices<V>): V
export function pick<V>(name: string, choices: Choices<V>): V
export function pick<V>(name: string, choices: Choices<V>): V {
  let { choices: cs, weights } = normalizeChoices(choices)
  let option = Random.pick(cs, weights)
  return resolveChoice(name, option, { type: 'pick', choices: cs })
}

/** Define a trait that samples from a set of many `choices`, either a certain `amount` of times, or between `min` and `max` amount of times. */
export function sample<V extends Narrowable>(
  name: string,
  amount: number,
  choices: Choices<V>
): V[]
export function sample<V>(
  name: string,
  amount: number,
  choices: Choices<V>
): V[]
export function sample<V extends Narrowable>(
  name: string,
  min: number,
  max: number,
  choices: Choices<V>
): V[]
export function sample<V>(
  name: string,
  min: number,
  max: number,
  choices: Choices<V>
): V[]
export function sample<V>(
  name: string,
  min: number,
  max: number | Choices<V>,
  choices?: Choices<V>
): V[] {
  if (typeof max !== 'number') (choices = max), (max = min)
  let { choices: cs, weights } = normalizeChoices(choices!)
  let amount = Random.int(min, max)
  let opts = Random.sample(amount, cs, weights)
  return resolveChoices(name, opts, { type: 'sample', min, max, choices: cs })
}

/** Setup the canvas and current scene for a sketch. */
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

/** The shorthand for define a set of choices. */
type Choices<V> =
  | Exclude<readonly V[], readonly any[][]>
  | readonly [number, V][]
  | Record<string, Exclude<V, any[]>>
  | Record<string, [number, V]>

/** Normalize the shorthand for defining choices into `OptionSchema` objects. */
function normalizeChoices<V>(choices: Choices<V>): {
  choices: SchemaChoice<V>[]
  values: V[]
  weights: number[]
} {
  let cs: SchemaChoice<V>[] = []
  let values: V[] = []
  let weights: number[] = []

  if (Array.isArray(choices)) {
    for (let sc of choices) {
      let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
      let v = value as V
      cs.push({ type: 'option', name: `${value}`, value: v, weight })
      values.push(v)
      weights.push(weight)
    }
  } else {
    for (let [name, sc] of Object.entries(choices)) {
      let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
      cs.push({ type: 'option', name, value, weight })
      values.push(value)
      weights.push(weight)
    }
  }

  return { choices: cs, values, weights }
}

/** Resolve a traits `value` and `schema`. */
function resolve<V>(
  name: string,
  value: V,
  schema: Exclude<Schema, SchemaPick | SchemaSample>
): V {
  let sketch = Sketch.assert()
  let v = name in sketch.traits ? sketch.traits[name] : value
  Sketch.trait(sketch, name, v, schema)
  return v
}

/** Resolve a `choice` trait and its `schema`. */
function resolveChoice<V>(
  name: string,
  choice: SchemaChoice<V>,
  schema: SchemaPick<V>
): V {
  let sketch = Sketch.assert()

  if (name in sketch.traits) {
    choice =
      schema.choices.find((o) => o.name === sketch!.traits[name]) ?? choice
  }

  Sketch.trait(sketch, name, choice.name, schema)
  return choice.value
}

/** Resolve a `choices` trait and its `schema`. */
function resolveChoices<V>(
  name: string,
  choices: SchemaChoice<V>[],
  schema: SchemaSample<V>
): V[] {
  let sketch = Sketch.assert()

  if (name in sketch.traits && Array.isArray(sketch.traits[name])) {
    let keys = sketch.traits[name] as any[]
    let cs = keys.map((k) => schema.choices.find((o) => o.name === k))
    if (cs.every((o) => o != null)) {
      choices = cs as SchemaChoice<V>[]
    }
  }

  let values: V[] = []
  let names: string[] = []
  for (let c of choices) {
    names.push(c.name)
    values.push(c.value)
  }

  Sketch.trait(sketch, name, names, schema)
  return values
}
