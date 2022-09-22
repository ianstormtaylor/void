import { ipcMain } from 'electron'
import { main } from './classes/main'
import { Tab } from './classes/tab'
import { Window } from './classes/window'

export let initializeIpc = () => {
  ipcMain.handle('getWindow', (e) => {
    let window = Window.bySenderId(e.sender.id)
    let json = main.store.windows[window.id]
    return json
  })

  ipcMain.handle('activateTab', (e, id) => {
    let window = Window.bySenderId(e.sender.id)
    window.activateTab(id)
  })

  ipcMain.handle('closeTab', (e, id) => {
    let window = Window.bySenderId(e.sender.id)
    window.closeTab(id)
  })

  ipcMain.handle('inspectTab', (e, id) => {
    let tab = Tab.byId(id)
    tab.inspect()
  })

  ipcMain.handle('open', (e) => {
    main.open()
  })
}
