import { Context } from 'svgcanvas'
import { svgStringToDataUri } from '../utils'
import {
  Sketch,
  Schema,
  SchemaChoice,
  Config,
  Random,
  SchemaPick,
  SchemaSample,
} from '..'

/** Define a trait that is a boolean, with optional `probability` of being true. */
export function bool(name: string, probability = 0.5): boolean {
  let value = Random.bool(probability)
  return resolve(name, value, { type: 'boolean', probability })
}

/** Define a `draw` function that renders each frame. */
export function draw(fn: (frame: Sketch['frame']) => void) {
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must call Void.draw() inside a sketch!`)
  }

  sketch.draw = fn
  return {
    play: () => Sketch.play(sketch!),
    pause: () => Sketch.pause(sketch!),
    stop: () => Sketch.stop(sketch!),
  }
}

/** Define a trait that is a floating point number, between `min` and `max`, with optional `step` to increment by. */
export function float(
  name: string,
  min: number,
  max: number,
  step?: number
): number {
  let value = Random.float(min, max, step)
  resolve(name, value, { type: 'float', min, max, step })
  return value
}

/** Define a trait that is an integer, between `min` and `max`, with optional `step` to increment by. */
export function int(name: string, min: number, max: number, step = 1): number {
  let value = Random.int(min, max, step)
  resolve(name, value, { type: 'int', min, max, step })
  return value
}

/** Get a canvas layer to draw with. */
export function layer(name?: string): CanvasRenderingContext2D {
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must call Void.layer() inside a sketch!`)
  }

  if (!name) {
    let { length } = Object.keys(sketch.layers)
    while ((name = `Layer ${++length}`) in sketch.layers) {}
  }

  let { settings, output, overrides } = sketch
  let { width, height, margin, units } = settings
  let hidden = overrides.layers?.[name]?.hidden ?? false
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
  canvas.width = deviceWidth
  canvas.height = deviceHeight
  canvas.style.position = 'absolute'
  canvas.style.width = `${pixelWidth}px`
  canvas.style.height = `${pixelHeight}px`
  ctx.scale(deviceWidth / totalWidth, deviceHeight / totalHeight)
  ctx.translate(top, left)

  sketch.layers[name] = {
    hidden,
    export: () => {
      return vector
        ? svgStringToDataUri(ctx.getSerializedSvg())
        : canvas.toDataURL('image/png')
    },
  }

  if (!hidden) {
    sketch.el.appendChild(canvas)
  }

  return ctx
}

/** Define a trait that picks one of many `choices`. */
export function pick<V>(name: string, choices: Choices<V>): V {
  let { choices: cs, weights } = normalizeChoices(choices)
  let option = Random.pick(cs, weights)
  return resolveChoice(name, option, { type: 'pick', choices: cs })
}

/** Define a trait that samples from a set of many `choices`, either a certain `amount` of times, or between `min` and `max` amount of times. */
export function sample<V>(
  name: string,
  amount: number,
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

  config ??= {}
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must call Void.settings() inside a sketch!`)
  }

  let { settings } = sketch
  let defaults: Config = { dimensions: [settings.width, settings.height, 'px'] }
  let overrides = sketch.overrides.config ?? {}
  let c = Config.merge(defaults, config, overrides)
  let s = Config.settings(c)
  sketch.config = c
  sketch.settings = s
  return s
}

/** The shorthand for define a set of choices. */
type Choices<V> =
  | Exclude<V, any[]>[]
  | [number, V][]
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
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must define traits inside a Void sketch function!`)
  }

  let traits = sketch.overrides?.traits ?? sketch.traits
  let v = name in traits ? (traits[name] as any) : value
  sketch.schemas[name] = schema
  sketch.traits[name] = v
  return v
}

/** Resolve a `choice` trait and its `schema`. */
function resolveChoice<V>(
  name: string,
  choice: SchemaChoice<V>,
  schema: SchemaPick<V>
): V {
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must define traits inside a Void sketch function!`)
  }

  let traits = sketch.overrides?.traits ?? sketch.traits
  if (name in traits) {
    choice = schema.choices.find((o) => o.name === traits[name]) ?? choice
  }

  sketch.schemas[name] = schema
  sketch.traits[name] = choice.name
  return choice.value
}

/** Resolve a `choices` trait and its `schema`. */
function resolveChoices<V>(
  name: string,
  choices: SchemaChoice<V>[],
  schema: SchemaSample<V>
): V[] {
  let sketch = Sketch.current()
  if (!sketch) {
    throw new Error(`You must define traits inside a Void sketch function!`)
  }

  let traits = sketch.overrides?.traits ?? sketch.traits
  if (name in traits && Array.isArray(traits[name])) {
    let keys = traits[name] as any[]
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

  sketch.schemas[name] = schema
  sketch.traits[name] = names
  return values
}
