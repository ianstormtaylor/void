import { app, dialog, Menu } from 'electron'
import { Draft } from 'immer'
import Store from 'electron-store'
import { Config, initialConfig } from '../../shared/config'
import { IS_MAC } from '../../shared/env'
import { initializeIpc as loadIpc } from '../ipc'
import { appMenu, dockMenu } from '../menus'
import { Tab } from './tab'
import { Window } from './window'
import { Sketch } from './sketch'
import { createSharedStore } from '../../shared/shared-state'

/** The `Main` object stores state about the entire app on the main thread. */
export class Main {
  /** A reference to each `Window` instance by id. */
  windows: Record<string, Window>

  /** A reference to each `Tab` instance by id. */
  tabs: Record<string, Tab>

  /** A reference to each `Sketch` instance by id. */
  sketches: Record<string, Sketch>

  /** A flag to know when windows are closing by quit or by choice. */
  isQuitting: boolean

  /** The persistent store that gets saved to a JSON file. */
  #store: Store<Config>

  /** The shared store that gets synced to renderer processes. */
  #shared: ReturnType<typeof createSharedStore<Config>>

  /** Create a new `Main` singleton. */
  constructor() {
    let store = new Store({
      defaults: initialConfig,
    })

    let shared = createSharedStore<Config>({
      sketches: store.get('sketches'),
      tabs: store.get('tabs'),
      windows: store.get('windows'),
    })

    this.#store = store
    this.#shared = shared
    this.isQuitting = false
    this.windows = {}
    this.tabs = {}
    this.sketches = {}

    shared.subscribe((state) => {
      store.set('sketches', state.sketches)
      store.set('tabs', state.tabs)
      store.set('windows', state.windows)
    })

    // On macOS, don't quit when all windows are closed.
    app.on('window-all-closed', () => {
      if (!IS_MAC) this.quit()
    })

    // On macOS, this fires when clicking the dock icon.
    app.on('activate', () => {
      let window = Window.byActive()
      if (window) {
        window.focus()
      } else {
        let window = Window.create()
        window.show()
      }
    })

    app.on('before-quit', () => {
      this.isQuitting = true
    })

    app.on('quit', () => {
      this.isQuitting = false
    })

    app.on('ready', () => {
      // If there is already an app instance, quit so only one is ever open.
      if (!app.requestSingleInstanceLock()) {
        console.log('Quitting for single instance lock…')
        this.quit()
        return
      }

      // Load the IPC channels and menu items.
      loadIpc()
      Menu.setApplicationMenu(appMenu)
      if (IS_MAC) app.dock.setMenu(dockMenu)

      // Try to restore any saved windows.
      this.restore()

      // If there is still no active window, create one.
      if (!Window.byActive()) {
        let window = Window.create()
        window.show()
      }
    })
  }

  /**
   * Getters & setters.
   */

  /** Get the main store's current state. */
  get store() {
    return this.#shared.getState()
  }

  /** Set the main store's state using an Immer `recipe` function. */
  change(recipe: (draft: Draft<Config>) => void): void {
    return this.#shared.setState(recipe)
  }

  /**
   * Actions.
   */

  /** Clear the persistent storage. */
  clear() {
    this.#store.clear()
  }

  /** Open sketches with the active window, or create a new one. */
  async open() {
    let result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })

    if (!result.filePaths.length) {
      return
    }

    let window = Window.byActive() ?? Window.create()
    for (let path of result.filePaths) {
      window.openTab(path)
    }

    window.show()
  }

  /** Quit the app. */
  quit() {
    app.quit()
  }

  /** Restore any saved windows. */
  restore() {
    console.log('Restoring store:', this.store)
    for (let id in this.store.windows) {
      let window = Window.restore(id)
      window.show()
    }
  }
}

/** Create a singleton `Main` instance. */
export let main = new Main()
