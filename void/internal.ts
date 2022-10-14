import { Module } from './interfaces/module'
import { Scene } from './interfaces/scene'
import { Schema } from './interfaces/schema'
import { ResolvedSettings, Settings } from './interfaces/settings'
import { Traits } from './interfaces/traits'

/** Setup the global `Void` variable for holding sketch state. */
window.Void = window.Void ?? {}

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
  let { el, overrides, canvas, context, scene, schema, settings, traits } =
    options
  Void.canvas = canvas
  Void.context = context
  Void.el = el
  Void.overrides = overrides
  Void.scene = scene
  Void.schema = schema
  Void.settings = settings
  Void.traits = traits
  module.default()
  return Void
}
