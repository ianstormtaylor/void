import { contextBridge, ipcRenderer } from 'electron'
import { initialConfig } from '../shared/config'
import { createRendererStore } from '../shared/store/renderer'

/** A shared store. */
let store = createRendererStore(initialConfig)

/** The global object exposed to use Electron APIs. */
export type Electron = typeof electron
export let electron = {
  store,
  activateTab,
  closeTab,
  inspectTab,
  open,
  openFiles,
}

// @ts-ignore
// window.electron = electron
contextBridge.exposeInMainWorld('electron', electron)

/** Active a tab by `id`. */
function activateTab(id: string): Promise<void> {
  return ipcRenderer.invoke('activateTab', id)
}

/** Close a tab by `id`. */
function closeTab(id: string): Promise<void> {
  return ipcRenderer.invoke('closeTab', id)
}

/** Inspect a tab by `id`. */
function inspectTab(id: string): Promise<void> {
  return ipcRenderer.invoke('inspectTab', id)
}

/** Open new tabs. */
function open(): Promise<void> {
  return ipcRenderer.invoke('open')
}

/** Open new files by `paths`. */
function openFiles(paths: string[]): Promise<void> {
  return ipcRenderer.invoke('openFiles', paths)
}
