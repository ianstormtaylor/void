import { Config, Options } from '../interfaces/config'
import { Output, Exporter } from '../interfaces/export'
import { Frame } from '../interfaces/frame'
import { Schema } from '../interfaces/schema'
import { Settings } from '../interfaces/settings'
import { Traits } from '../interfaces/traits'

/** The sketch-related methods. */
export * as Sketch from './methods'

/** An object representing a Void sketch's state. */
export type Sketch = {
  el: HTMLElement
  construct: () => void
  draw?: (frame: Frame) => void
  handlers: {
    construct: Array<() => void>
    draw: Array<() => void>
    play: Array<() => void>
    pause: Array<() => void>
    stop: Array<() => void>
  }
  overrides: {
    exporting?: Output
    layers?: Record<string, boolean>
    options?: Options
    settings?: Settings
    traits?: Traits
  }
  state?: {
    status?: 'playing' | 'paused' | 'stopped'
    config?: Config
    exporting?: Output
    frame: Frame
    layers: Record<string, () => string>
    raf?: number
    schema: Schema
    settings?: Settings
    traits: Traits
  }
}
