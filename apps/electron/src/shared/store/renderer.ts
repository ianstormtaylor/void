import { Store, createStore } from './base'

/** Create a store used in Electron renderer processes. */
export function createRendererStore<T extends Record<string, any>>(
  preloadStore: Store<T>
) {
  let isSyncing = false

  // Create a new store that sends patches to the preload process.
  let store = createStore(preloadStore.get(), (patches) => {
    if (!isSyncing && patches.length > 0) {
      preloadStore.patch(patches)
    }
  })

  // Sync any new patches from the preload process.
  preloadStore.subscribe((next, prev, patches) => {
    isSyncing = true
    store.patch(patches)
    isSyncing = false
  })

  return store
}
