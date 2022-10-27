import { Config, Options } from '../interfaces/config'
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
  overrides: {
    options?: Options
    settings?: Settings
    traits?: Traits
    layers?: Record<string, boolean>
  }
  state?: {
    config?: Config
    frame: Frame
    layers: Record<string, boolean>
    playing?: boolean
    raf?: number
    schema: Schema
    settings?: Settings
    traits: Traits
  }
}
