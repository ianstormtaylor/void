import { app, dialog, Menu } from 'electron'
import { IS_MAC } from '../shared/env'
import { initializeIpc } from './ipc'
import { appMenu, dockMenu } from './menus'
import { store } from './store'
import { Tab } from './tab'
import { Window } from './window'

/** The `Main` object stores state about the entire app on the main thread. */
export class Main {
  isQuitting: boolean

  /** Create a new `App` with a reference to the global. */
  constructor() {
    this.isQuitting = false

    app.on('ready', () => {
      if (!app.requestSingleInstanceLock()) {
        console.log('Quitting for single instance lock…')
        this.quit()
      } else {
        this.initialize()
      }
    })

    // On macOS, this fires when clicking the dock icon.
    app.on('activate', () => {
      let window = Window.active()
      if (window) {
        window.focus()
      } else {
        let window = new Window()
        window.show()
      }
    })

    // On macOS, don't quit when all windows are closed.
    app.on('window-all-closed', () => {
      if (!IS_MAC) this.quit()
    })

    app.on('before-quit', () => {
      this.isQuitting = true
    })

    app.on('quit', () => {
      this.isQuitting = false
    })
  }

  /** Initialize the app when it's first ready. */
  initialize() {
    initializeIpc()
    Menu.setApplicationMenu(appMenu)
    if (IS_MAC) app.dock.setMenu(dockMenu)

    let state = store.getState()
    let opened = false

    for (let t of Object.values(state.tabs)) {
      new Tab({
        id: t.id,
        path: t.path,
      })
    }

    for (let w of Object.values(state.windows)) {
      opened = true
      let window = new Window({
        id: w.id,
        tabIds: w.tabIds,
        activeTabId: w.activeTabId,
      })
      window.show()
    }

    if (!opened) {
      let window = new Window()
      window.show()
    }
  }

  /** Open sketches with the active window, or create a new one. */
  async open() {
    let window = Window.active() || new Window()
    let result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })
    if (result.filePaths.length === 0) return
    let tabs = result.filePaths.map((path) => new Tab({ path }))
    window.addTabs(tabs)
    window.activateTab(tabs.at(-1).id)
    window.show()
  }

  /** Quit the app. */
  quit() {
    app.quit()
  }
}

/** Create a singleton `Main` instance. */
export let main = new Main()
