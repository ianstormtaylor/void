import { contextBridge, ipcRenderer } from 'electron'
import { config, WindowConfig } from '../shared/config'
import { createSharedStore } from '../shared/shared-state'

/** A shared store. */
let store = createSharedStore(config)

/** The global object exposed to use Electron APIs. */
export type Electron = typeof electron
export let electron = {
  getWindow,
  activateTab,
  store,
}

// @ts-ignore
// window.electron = electron
contextBridge.exposeInMainWorld('electron', electron)

/** Get the window object of the renderer. */
async function getWindow(): Promise<WindowConfig> {
  return await ipcRenderer.invoke('getWindow')
}

/** Active a tab by `id`. */
async function activateTab(id: string): Promise<void> {
  return await ipcRenderer.invoke('activateTab', id)
}
