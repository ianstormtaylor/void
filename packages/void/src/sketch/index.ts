import { Config } from '../config'
import { Output } from '../interfaces/export'
import { Frame } from '../interfaces/frame'
import { Schema } from '../interfaces/schema'
import { Traits } from '../interfaces/traits'
import { Settings } from '../settings'

/** The sketch-related methods. */
export * as Sketch from './methods'

/** An object representing a Void sketch's state. */
export type Sketch = {
  config: Config
  construct: () => void
  draw?: (frame: Frame) => void
  el: HTMLElement
  frame?: Frame
  handlers: {
    construct: Array<() => void>
    draw: Array<() => void>
    play: Array<() => void>
    pause: Array<() => void>
    stop: Array<() => void>
  }
  layers: Record<string, () => string>
  output?: Output
  overrides: {
    layers?: Record<string, boolean>
    config?: Config
    traits?: Traits
  }
  raf?: number
  schema: Schema
  settings: Settings
  status: 'playing' | 'paused' | 'stopped'
  traits: Traits
}
