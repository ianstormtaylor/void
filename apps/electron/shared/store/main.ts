import { Patch } from 'immer'
import { ipcMain, webContents } from 'electron'
import { CHANGE_CHANNEL, CONNECT_CHANNEL } from './base'
import { createStore } from './base'

/** Create a store used in the Electron main process. */
export function createMainStore<T extends Record<string, any>>(
  initialState: T
) {
  let senderId: number | null = null
  let connections = new Set<number>()
  let store = createStore(initialState, (patches) => {
    if (patches.length > 0) {
      for (let id of connections) {
        if (senderId != null && id === senderId) continue
        let w = webContents.fromId(id)
        if (w) w.send(CHANGE_CHANNEL, patches)
      }
    }
  })

  // When a renderer connects, send it the current state and store its id.
  ipcMain.on(CONNECT_CHANNEL, (e) => {
    e.sender.send(CONNECT_CHANNEL, store.get())
    connections.add(e.sender.id)
  })

  // When a renderer sends changes, apply them and broadcast to others.
  ipcMain.on(CHANGE_CHANNEL, (e, patches: Patch[]) => {
    senderId = e.sender.id
    store.patch(patches)
    senderId = null
  })

  return store
}
