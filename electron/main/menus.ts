import { App, app, Menu } from 'electron'
import { IS_MAC } from './env'
import { Window } from './window'

/**
 * Initialize menus.
 */

export let initializeMenus = (app: App) => {
  Menu.setApplicationMenu(appMenu)
  if (IS_MAC) app.dock.setMenu(dockMenu)
}

/** A dock menu. */
export let dockMenu = Menu.buildFromTemplate([
  {
    label: 'Open Sketch…',
    click() {
      let window = Window.active()
      window.openFile()
    },
  },
  { role: 'recentDocuments', submenu: [{ role: 'clearRecentDocuments' }] },
])

/** The app's top-level menu. */
export let appMenu = Menu.buildFromTemplate([
  {
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'Open Sketch…',
        accelerator: 'CmdOrCtrl+O',
        click() {
          let window = Window.active()
          window.openFile()
        },
      },
      { role: 'recentDocuments', submenu: [{ role: 'clearRecentDocuments' }] },
      { type: 'separator' },
      {
        label: 'Close Sketch',
        accelerator: 'CmdOrCtrl+W',
        click() {
          console.log('close sketch clicked')
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      { role: 'toggleDevTools' },
    ],
  },
])
