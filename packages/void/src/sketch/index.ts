import { Config, Output, Units, Schema } from '..'

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
  seed: number
  settings: {
    dpi: number
    fps: number
    frames: number
    height: number
    margin: [number, number, number, number]
    precision: number
    units: Units
    width: number
  }
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

/** Data about the mouse while a sketch is running. */
export type Pointer = {
  type: 'mouse' | 'pen' | 'touch' | null
  x: number | null
  y: number | null
  point: [number, number] | null
  button: number | null
  buttons: Record<number, true>
}
