import ElectronStore from 'electron-store'

export type WindowConfig = {
  id: string
  tabIds: string[]
  activeTabId: string | null
}

export type TabConfig = {
  id: string
  path: string
  entrypoint: string | null
  inspecting: boolean
}

export type Config = {
  windows: Record<string, WindowConfig>
  tabs: Record<string, TabConfig>
}

export let config = {
  store: {
    windows: {},
    tabs: {},
  } as Config,
}

// export let config = new ElectronStore<Config>({
//   defaults: {
//     windows: [],
//     tabs: [],
//   },
// })
