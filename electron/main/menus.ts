import { Menu, app } from 'electron'
import { main } from './classes/main'
import { Tab } from './classes/tab'

/** A dock menu. */
export let dockMenu = Menu.buildFromTemplate([
  {
    label: 'Open Sketch…',
    click() {
      main.open()
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
          main.open()
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
      {
        // role: 'toggleDevTools',
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Alt+I',
        click() {
          let tab = Tab.byActive()
          if (tab) tab.inspect()
        },
      },
    ],
  },
])
