import { Menu, app } from 'electron'
import { IS_DEV } from './env'
import { main } from './classes/main'
import { Tab } from './classes/tab'
import { Window } from './classes/window'

/** A dock menu. */
export let dockMenu = Menu.buildFromTemplate([
  {
    label: 'New Window',
    accelerator: 'CmdOrCtrl+N',
    click() {
      let window = Window.create()
      window.show()
    },
  },
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
        label: 'New Window',
        accelerator: 'CmdOrCtrl+N',
        click() {
          let window = Window.create()
          window.show()
        },
      },
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
          let tab = Tab.byActive()
          let window = Window.byActive()
          if (window && tab) window.closeTab(tab.id)
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click() {
          let tab = Tab.byActive()
          if (tab) tab.reload()
        },
      },
      { type: 'separator' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      {
        label: 'Toggle Developer Tools',
        accelerator: 'CmdOrCtrl+Alt+I',
        click() {
          let tab = Tab.byActive()
          if (tab) tab.inspect()
        },
      },
    ],
  },
  {
    label: 'Development',
    visible: IS_DEV,
    submenu: [
      {
        label: 'Reload Window',
        click() {
          let window = Window.getFocused()
          if (window) window.reload()
        },
      },
      {
        label: 'Toggle Window Developer Tools',
        click() {
          let window = Window.getFocused()
          if (window) window.inspect()
        },
      },
      { type: 'separator' },
      {
        label: 'Log Storage',
        click() {
          console.log('')
          console.log('Store:', JSON.stringify(main.store, null, 2))
        },
      },
      {
        label: 'Clear Storage and Quit',
        click() {
          main.clear()
          main.quit()
        },
      },
    ],
  },
])
