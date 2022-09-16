import { ipcRenderer } from 'electron'

export type Electron = typeof electron
export let electron = {
  onEntrypoint,
  getEntrypoint,
}

// @ts-ignore
window.electron = electron
// contextBridge.exposeInMainWorld('electron', electron)

/** Listen for the `entrypoint` event to fire with a `url`. */
function onEntrypoint(callback: (url: string) => void) {
  ipcRenderer.on('entrypoint', (e, url) => {
    console.log({ url })
    callback(url)
  })
}

/** Get the entrypoint for a sketch. */
async function getEntrypoint(): Promise<string> {
  return await ipcRenderer.invoke('get-entrypoint')
}
