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
  entrypointId: string
  zoom: number | null
  seed: number
  config: Config
  traits: Record<string, any>
  layers: Record<string, { hidden: boolean }>
}

/** The saved state of a `Entrypoint`. */
export type EntrypointState = {
  id: string
  path: string
  url: string | null
  timestamp: number | null
}

/** The saved state of the entire app. */
export type StoreState = {
  entrypoints: Record<string, EntrypointState>
  tabs: Record<string, TabState>
  windows: Record<string, WindowState>
}

/** The initial empty state of the app. */
export let initialState: StoreState = {
  entrypoints: {},
  tabs: {},
  windows: {},
}
