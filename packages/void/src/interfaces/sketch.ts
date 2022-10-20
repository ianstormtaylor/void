import { Scene } from './scene'
import { Schema } from './schema'
import { ResolvedSettings } from './settings'
import { Traits } from './traits'

/** The internal sketch state when a sketch is running. */
export type Sketch = {
  scene: Scene
  settings: ResolvedSettings
  traits: Traits
  schema: Schema
}
