import { Module } from './interfaces/module'
import { Scene } from './interfaces/scene'
import { Schema } from './interfaces/schema'
import { ResolvedSettings, Settings } from './interfaces/settings'
import { Traits } from './interfaces/traits'

/** Setup the global `Void` variable for holding sketch state. */
globalThis.Void = globalThis.Void ?? {}

/** The Void global for attaching the current scene as it's running. */
export type Void = {
  overrides?: Settings
  el?: HTMLElement
  settings?: ResolvedSettings
  scene?: Scene
  traits?: Traits
  schema?: Schema
  canvas?: HTMLCanvasElement
  context?: CanvasRenderingContext2D
}

/** Setup the scene for a sketch. */
export function setup(options: Settings): Scene {
  if (Void.scene == null) {
    let overrides = Void.overrides ?? {}
    Void.settings = Settings.resolve(Settings.merge(options, overrides))
    Void.scene = Scene.create(Void.settings)
  }

  if (Void.traits == null) {
    Void.traits = {}
  }

  if (Void.schema == null) {
    Void.schema = {}
  }

  return Void.scene
}

/** Run a sketch `module` with `el` and `overrides`. */
export function run(
  module: Module,
  options: {
    el?: HTMLElement
    overrides?: Settings
    canvas?: HTMLCanvasElement
    context?: CanvasRenderingContext2D
    settings?: ResolvedSettings
    schema?: Schema
    traits?: Traits
    scene?: Scene
  } = {}
) {
  Void.canvas = options.canvas
  Void.context = options.context
  Void.el = options.el
  Void.overrides = options.overrides
  Void.scene = options.scene
  Void.schema = options.schema
  Void.settings = options.settings
  Void.traits = options.traits
  module.default()
  let ret = { ...Void }
  delete Void.canvas
  delete Void.context
  delete Void.el
  delete Void.overrides
  delete Void.scene
  delete Void.schema
  delete Void.settings
  delete Void.traits
  return ret
}
