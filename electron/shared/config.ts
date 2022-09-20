import ElectronStore from 'electron-store'

export type Config = {
  windows: Record<
    string,
    {
      id: string
    }
  >
  tabs: Record<
    string,
    {
      id: string
      windowId: string
      path: string
      entrypoint: string | null
    }
  >
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
