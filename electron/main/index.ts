import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { IS_MAC } from './env'
import { appMenu, dockMenu } from './menus'
import { open } from './open'
import { Window } from './window'

// When the app is first started and ready.
app.on('ready', () => {
  if (!app.requestSingleInstanceLock()) {
    app.quit()
  }

  Menu.setApplicationMenu(appMenu)

  if (IS_MAC) {
    app.dock.setMenu(dockMenu)
  }

  ipcMain.handle('get-entrypoint', (e) => {
    let id = e.sender.id
    let w = Window.get(id)
    return w.entrypoint
  })

  open()
})

// When all windows are closed, except on Mac where it stays active.
app.on('window-all-closed', () => {
  if (!IS_MAC) {
    app.quit()
  }
})

// When the app has been re-activated on Mac, after all windows were closed.
app.on('activate', () => {
  let [win] = Window.all()
  if (win) {
    win.browser.focus()
  } else {
    open()
  }
})

// When the app is being quit.
app.on('before-quit', () => {
  app.clearRecentDocuments()
})
