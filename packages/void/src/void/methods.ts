import * as Generate from './generators'
import { Context } from 'svgcanvas'
import {
  Frame,
  Options,
  Settings,
  Sketch,
  AnySchema,
  ChoiceSchema,
  SampleSchema,
  FloatSchema,
  IntSchema,
  Json,
  OptionSchema,
  BoolSchema,
  Config,
} from '..'
import { svgStringToDataUri } from '../utils'

/** Define a trait that is a boolean, with optional `probability` of being true. */
export function bool(name: string, probability = 0.5): boolean {
  let schema: BoolSchema = { type: 'boolean', probability }
  let value = Generate.bool(schema)
  return register(name, value, schema)
}

/** Define a trait that is one of many `choices`. */
export function choice<V extends Json>(name: string, choices: Choices<V>): V {
  let options = normalizeChoices(choices)
  let schema: ChoiceSchema<V> = { type: 'choice', options }
  let value = Generate.choice(schema)
  return register(name, value, schema)
}

/** Define a `draw` function that renders each frame. */
export function draw(fn: (frame: Frame) => void) {
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
  let schema: FloatSchema = { type: 'float', min, max, step }
  let value = Generate.float(schema)
  return register(name, value, schema)
}

/** Define a trait that is an integer, between `min` and `max`, with optional `step` to increment by. */
export function int(name: string, min: number, max: number, step = 1): number {
  let schema: IntSchema = { type: 'int', min, max, step }
  let value = Generate.int(schema)
  return register(name, value, schema)
}

/** Get a canvas layer to draw with. */
export function layer(name: string): CanvasRenderingContext2D {
  let sketch = Sketch.current()
  let state = sketch?.state
  if (!sketch || !state) {
    throw new Error(`You must call Void.layer() inside a sketch!`)
  }

  let { settings, exporting } = state
  if (!settings) {
    throw new Error(`You must call Void.layer() after Void.settings()!`)
  }

  let canvas = document.createElement('canvas')
  let ctx: any
  let format = exporting?.type
  let isSvg = format === 'svg' || format === 'pdf'

  if (isSvg) {
    let { width, height, units } = settings
    ctx = new Context(`${width}${units}`, `${height}${units}`)
  } else {
    ctx = canvas.getContext('2d')
  }

  if (!ctx) {
    throw new Error(`Unable to get 2D rendering context from Canvas!`)
  }

  let [outerWidth, outerHeight] = Settings.outerDimensions(settings)
  let [screenWidth, screenHeight] = Settings.screenDimensions(settings)
  let [outputWidth, outputHeight] = Settings.outputDimensions(settings)
  canvas.width = screenWidth
  canvas.height = screenHeight
  canvas.style.width = `${outputWidth}px`
  canvas.style.height = `${outputHeight}px`
  ctx.scale(screenWidth / outerWidth, screenHeight / outerHeight)
  ctx.translate(settings.margin[1], settings.margin[0])

  if (sketch.overrides.layers?.[name] !== false) {
    sketch.el.appendChild(canvas)
    state.layers[name] = () => {
      if (isSvg) {
        let string = ctx.getSerializedSvg()
        let url = svgStringToDataUri(string)
        return url
      } else {
        let url = canvas.toDataURL('image/png')
        return url
      }
    }
  }

  return ctx
}

/** Define a trait that samples from a set of many `choices`, either a certain `amount` of times, or between `min` and `max` amount of times. */
export function sample<V extends Json>(
  name: string,
  amount: number,
  choices: Choices<V>
): V[]
export function sample<V extends Json>(
  name: string,
  min: number,
  max: number,
  choices: Choices<V>
): V[]
export function sample<V extends Json>(
  name: string,
  min: number,
  max: number | Choices<V>,
  choices?: Choices<V>
): V[] {
  if (typeof max !== 'number') (choices = max), (max = min)
  let options = normalizeChoices(choices!)
  let schema: SampleSchema<V> = { type: 'sample', min, max, options }
  let value = Generate.sample(schema)
  return register(name, value, schema)
}

/** Setup the canvas and current scene for a sketch. */
export function settings(options: Options): Settings {
  let sketch = Sketch.current()
  let state = sketch?.state
  if (!sketch || !state) {
    throw new Error(`You must call Void.settings() inside a sketch!`)
  }

  state.config = Config.create(options, sketch.overrides.options ?? {})
  state.settings = Settings.create(state.config)
  return state.settings
}

/** Define a Void sketch with a `construct` function. */
export function sketch(construct: Sketch['construct']): Sketch['construct'] {
  return construct
}

/** The shorthand for define a set of choices. */
type Choices<V extends Json> =
  | Exclude<V, any[]>[]
  | [number, V][]
  | Record<string, Exclude<V, any[]>>
  | Record<string, [number, V]>

/** Normalize the shorthand for defining choices into `OptionSchema` objects. */
function normalizeChoices<V extends Json>(
  choices: Choices<V>
): OptionSchema<V>[] {
  if (Array.isArray(choices)) {
    return choices.map((sc) => {
      let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
      let name = `${value}`
      return { type: 'option', name, value, weight } as OptionSchema
    })
  } else {
    return Object.entries(choices).map(([name, sc]) => {
      let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
      return { type: 'option', name, value, weight } as OptionSchema
    })
  }
}

/** Register a trait value and schema on the global Void namespace. */
function register<V extends Json>(
  name: string,
  value: V,
  schema: AnySchema
): V {
  let sketch = Sketch.current()
  let state = sketch?.state
  if (!sketch || !state) {
    throw new Error(`You must call Trait functions from inside a Void sketch!`)
  }

  let traits = sketch.overrides?.traits ?? {}
  let v = name in traits ? traits[name] : value
  state.schema[name] = schema
  state.traits[name] = v
  return v
}
