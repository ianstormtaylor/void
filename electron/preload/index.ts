import { ipcRenderer } from 'electron'
import { TabJSON } from '../main/tab'

/** The global object exposed to use Electron APIs. */
export type Electron = typeof electron
export let electron = {
  getTabs,
  onTabs,
}

// @ts-ignore
window.electron = electron
// contextBridge.exposeInMainWorld('electron', electron)

/** Get the tabs for a window. */
async function getTabs(): Promise<TabJSON[]> {
  console.log('getTabs')
  return await ipcRenderer.invoke('get-tabs')
}

/** Listen for the `tabs` event to fire with new data. */
function onTabs(callback: (tabs: TabJSON[]) => void) {
  ipcRenderer.on('tabs', (e, tabs) => {
    console.log('onTabs', tabs)
    callback(tabs)
  })

  ipcRenderer.invoke('get-tabs').then((tabs) => callback(tabs))
}
