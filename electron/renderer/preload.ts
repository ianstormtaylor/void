import { contextBridge, ipcRenderer } from 'electron'
import { initialConfig } from '../shared/config'
import { createSharedStore } from '../shared/shared-state'

/** A shared store. */
let store = createSharedStore(initialConfig)

/** The global object exposed to use Electron APIs. */
export type Electron = typeof electron
export let electron = {
  store,
  activateTab,
  closeTab,
  inspectTab,
  open,
}

// @ts-ignore
// window.electron = electron
contextBridge.exposeInMainWorld('electron', electron)

/** Active a tab by `id`. */
async function activateTab(id: string): Promise<void> {
  return await ipcRenderer.invoke('activateTab', id)
}

/** Close a tab by `id`. */
async function closeTab(id: string): Promise<void> {
  return await ipcRenderer.invoke('closeTab', id)
}

/** Inspect a tab by `id`. */
async function inspectTab(id: string): Promise<void> {
  return await ipcRenderer.invoke('inspectTab', id)
}

/** Open new tabs. */
async function open(): Promise<void> {
  return await ipcRenderer.invoke('open')
}
