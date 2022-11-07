import { Config, Output, Units, Schema } from '..'

/** The sketch-related methods. */
export * as Sketch from './methods'

/** A frame of a sketch's draw function. */
export type Frame = {
  count: number
  time: number
  rate: number
}

/** Data about the mouse while a sketch is running. */
export type Mouse = {
  x: number | null
  y: number | null
}

/** A layer of the sketch. */
export type Layer = {
  hidden?: boolean
  export: () => string
}

/** An object representing a Void sketch's state. */
export type Sketch = {
  config: Config
  construct: () => void
  draw?: (frame: Frame) => void
  container: HTMLElement
  el: HTMLElement
  frame?: Frame
  handlers: {
    construct: Array<() => void>
    draw: Array<() => void>
    error: Array<(error: Error) => void>
    play: Array<() => void>
    pause: Array<() => void>
    stop: Array<() => void>
  }
  layers: Record<string, Layer>
  mouse?: Mouse
  output: Output
  overrides: {
    layers?: Record<string, { hidden: boolean }>
    config?: Config
    traits?: Record<string, any>
  }
  raf?: number
  schemas: Record<string, Schema>
  settings: {
    dpi: number
    fps: number
    frames: number
    hash: string
    height: number
    margin: [number, number, number, number]
    precision: number
    seed: number
    units: Units
    width: number
  }
  status: 'playing' | 'paused' | 'stopped'
  traits: Record<string, any>
}
