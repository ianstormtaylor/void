import { Patch } from 'immer'
import { ipcRenderer } from 'electron'
import { CHANGE_CHANNEL, CONNECT_CHANNEL } from './base'
import { createStore } from './base'

/** Create a store used in Electron renderer processes. */
export function createPreloadStore<T extends Record<string, any>>(
  initialState: T
) {
  let isSyncing = false
  let store = createStore(initialState, (patches) => {
    if (!isSyncing && patches.length > 0) {
      ipcRenderer.send(CHANGE_CHANNEL, patches)
    }
  })

  // When the renderer first connects, it will get sent the current state.
  ipcRenderer.on(CONNECT_CHANNEL, (e, state: T) => {
    isSyncing = true
    store.change(() => state)
    isSyncing = false
  })

  // When the renderer receives a change, apply it and emit.
  ipcRenderer.on(CHANGE_CHANNEL, (e, patches: Patch[]) => {
    isSyncing = true
    store.patch(patches)
    isSyncing = false
  })

  // Ask for the current state.
  ipcRenderer.send(CONNECT_CHANNEL)
  return store
}
