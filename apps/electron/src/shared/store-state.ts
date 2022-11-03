import { Config } from 'void'

/** The saved state of a `Window`. */
export type WindowState = {
  id: string
  tabIds: string[]
  activeTabId: string | null
  x: number
  y: number
  width: number
  height: number
}

/** The saved state of a `Tab`. */
export type TabState = {
  id: string
  sketchId: string
  inspecting: boolean
  zoom: number | null
  config: Config
  traits: Record<string, any>
  layers: Record<string, { hidden: boolean }>
}

/** The saved state of a `Sketch`. */
export type SketchState = {
  id: string
  path: string
  entrypoint: string | null
}

/** The saved state of the entire app. */
export type StoreState = {
  sketches: Record<string, SketchState>
  tabs: Record<string, TabState>
  windows: Record<string, WindowState>
}

/** The initial empty state of the app. */
export let initialState: StoreState = {
  sketches: {},
  tabs: {},
  windows: {},
}
