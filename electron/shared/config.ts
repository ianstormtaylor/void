import { Settings } from '../../void'

/** The saved state of a `Window`. */
export type WindowConfig = {
  id: string
  tabIds: string[]
  activeTabId: string | null
  x: number
  y: number
  width: number
  height: number
}

/** The saved state of a `Tab`. */
export type TabConfig = {
  id: string
  sketchId: string
  inspecting: boolean
  zoom: number | null
  settings: Settings
}

/** The saved state of a `Sketch`. */
export type SketchConfig = {
  id: string
  path: string
  entrypoint: string | null
}

/** The saved state of the entire app. */
export type Config = {
  sketches: Record<string, SketchConfig>
  tabs: Record<string, TabConfig>
  windows: Record<string, WindowConfig>
}

/** The initial empty state of the app. */
export let initialConfig: Config = {
  sketches: {},
  tabs: {},
  windows: {},
}
