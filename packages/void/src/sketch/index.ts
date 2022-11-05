import { Config, Output, Orientation, Units, Schema } from '..'

/** The sketch-related methods. */
export * as Sketch from './methods'

/** A frame of a sketch's draw function. */
export type Frame = {
  count: number
  time: number
  rate: number
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
  handlers: Record<
    'construct' | 'draw' | 'play' | 'pause' | 'stop',
    Array<() => void>
  >
  layers: Record<string, Layer>
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
