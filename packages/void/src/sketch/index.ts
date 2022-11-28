import { Config, Units } from '..'

/** The sketch-related methods. */
export * as Sketch from './methods'

/** An object representing a Void sketch's state. */
export type Sketch = {
  config: Config
  construct: () => void
  draw?: () => void
  container: HTMLElement
  el: HTMLElement
  frame?: Frame
  handlers?: Handlers
  hash: string
  keyboard?: Keyboard
  layers: Record<string, Layer>
  pointer?: Pointer
  output: Output
  prng?: () => number
  raf?: number
  schemas?: Record<string, Schema>
  settings: Settings
  status?: 'playing' | 'paused' | 'stopped'
  traits: Record<string, any>
}

/** A frame of a sketch's draw function. */
export type Frame = {
  count: number
  time: number
  rate: number
}

/** The event handlers of a sketch. */
export type Handlers = {
  construct: Array<() => void>
  draw: Array<() => void>
  error: Array<(error: Error) => void>
  play: Array<() => void>
  pause: Array<() => void>
  stop: Array<() => void>
}

/** Data about the keyboard while a sketch is running. */
export type Keyboard = {
  code: string | null
  codes: Record<string, true>
  key: string | null
  keys: Record<string, true>
}

/** A layer of the sketch. */
export type Layer = {
  hidden: boolean
  export?: () => string
}

/** Output settings when exporting a sketch. */
export type Output = OutputPng | OutputJpg | OutputWebp | OutputSvg | OutputPdf

/** PNG output settings. */
export type OutputPng = {
  type: 'png'
}

/** JPG output settings. */
export type OutputJpg = {
  type: 'jpg'
  quality: number
}

export type OutputWebp = {
  type: 'webp'
  quality?: number
}

export type OutputSvg = {
  type: 'svg'
}

export type OutputPdf = {
  type: 'pdf'
  rasterize?: boolean
}

/** Data about the mouse while a sketch is running. */
export type Pointer = {
  type: 'mouse' | 'pen' | 'touch' | null
  x: number | null
  y: number | null
  position: [number, number] | null
  button: number | null
  buttons: Record<number, true>
}

/** A schema which defines the values of a trait. */
export type Schema = SchemaBool | SchemaInt | SchemaFloat | SchemaPick

/** A schema for boolean traits. */
export type SchemaBool = {
  type: 'boolean'
  probability: number
  initial?: boolean
}

/** A schema for integer traits. */
export type SchemaInt = {
  type: 'int'
  min: number
  max: number
  step: number
  initial?: number
}

/** A schema for floating point number traits. */
export type SchemaFloat = {
  type: 'float'
  min: number
  max: number
  step?: number
  initial?: number
}

/** A schema for enum traits. */
export type SchemaPick = {
  type: 'pick'
  names: string[]
  weights: number[]
  initial?: string
}

/** The userland-exposed settings of a sketch. */
export type Settings = {
  dpi: number
  fps: number
  frames: number
  height: number
  margin: [number, number, number, number]
  precision: number | null
  units: Units
  width: number
}
