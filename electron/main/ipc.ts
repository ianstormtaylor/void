import { App, ipcMain } from 'electron'
import { store } from './store'
import { Window } from './window'

/**
 * Initialize menus.
 */

export let initializeIpc = (app: App) => {
  ipcMain.handle('getWindow', (e) => {
    let windows = Window.all()
    let window = windows.find((w) => w.browserWindow.id === e.sender.id)
    let state = store.getState()
    let json = state.windows[window.id]
    return json
  })

  ipcMain.handle('activateTab', (e, id) => {
    let windows = Window.all()
    let window = windows.find((w) => w.browserWindow.id === e.sender.id)
    window.activateTab(id)
  })
}
