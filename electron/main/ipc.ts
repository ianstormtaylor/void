import { ipcMain } from 'electron'
import { main } from './main'
import { store } from './store'
import { Tab } from './tab'
import { Window } from './window'

export let initializeIpc = () => {
  ipcMain.handle('getWindow', (e) => {
    let windows = Window.all()
    let window = windows.find((w) => w.browserWindow.id === e.sender.id)
    let state = store.getState()
    let json = state.windows[window.id]
    return json
  })

  ipcMain.handle('activateTab', (e, id) => {
    let window = Window.all().find((w) => w.browserWindow.id === e.sender.id)
    window.activateTab(id)
  })

  ipcMain.handle('closeTab', (e, id) => {
    let window = Window.all().find((w) => w.browserWindow.id === e.sender.id)
    window.closeTab(id)
  })

  ipcMain.handle('inspectTab', (e, id) => {
    let tab = Tab.get(id)
    tab.inspect()
  })

  ipcMain.handle('open', (e) => {
    main.open()
  })
}
