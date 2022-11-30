import { app, dialog, Menu, session } from 'electron'
import { Draft } from 'immer'
import ElectronStore from 'electron-store'
import { StoreState, initialState } from '../../shared/store-state'
import { IS_DEV, IS_MAC, IS_PROD, MODE } from '../env'
import * as ENV from '../env'
import { initializeIpc as loadIpc } from '../ipc'
import { appMenu, dockMenu } from '../menus'
import { Tab } from './tab'
import { Window } from './window'
import { Entrypoint } from './entrypoint'
import { createMainStore } from '../../shared/store/main'
import { Store as SharedStore } from '../../shared/store/base'
import updateElectronApp from 'update-electron-app'
import log from 'electron-log'
import unhandled from 'electron-unhandled'
import fixPath from 'fix-path'

/** The `Main` object stores state about the entire app on the main thread. */
export class Main {
  /** A reference to each `Window` instance by id. */
  windows: Record<string, Window>

  /** A reference to each `Tab` instance by id. */
  tabs: Record<string, Tab>

  /** A reference to each `Entrypoint` instance by id. */
  entrypoints: Record<string, Entrypoint>

  /** A flag to know when windows are closing by quit or by choice. */
  isQuitting: boolean

  /** The persistent store that gets saved to a JSON file. */
  #store: ElectronStore<StoreState>

  /** The shared store that gets synced to renderer processes. */
  #shared: SharedStore<StoreState>

  /** Create a new `Main` singleton. */
  constructor() {
    log.warn('Starting main process…', {
      ENV,
      app: {
        name: app.getName(),
        version: app.getVersion(),
        path: app.getAppPath(),
        isPackaged: app.isPackaged,
      },
    })

    // Catch unhandled errors.
    unhandled()

    // Fix the PATH so that `node` is available for spawning processes.
    fixPath()

    // Automatically try to keep the app up to date.
    if (IS_PROD) {
      updateElectronApp()
    }

    // Start the config store, and a shared store for communicating with renderers.
    let store = new ElectronStore({
      defaults: initialState,
      name: `config-${MODE}`,
    })

    let shared = createMainStore({
      entrypoints: store.get('entrypoints'),
      tabs: store.get('tabs'),
      windows: store.get('windows'),
    })

    this.#store = store
    this.#shared = shared
    this.isQuitting = false
    this.windows = {}
    this.tabs = {}
    this.entrypoints = {}

    shared.subscribe((state) => {
      store.set('entrypoints', state.entrypoints)
      store.set('tabs', state.tabs)
      store.set('windows', state.windows)
    })

    app.on('ready', async () => {
      log.info('Received `ready` event')

      // If there is already an app instance, quit so only one is ever open.
      if (!app.requestSingleInstanceLock()) {
        log.info('ARGV', process.argv)
        log.info('Quitting for single instance lock…')
        this.quit()
        return
      }

      // Load the IPC channels and menu items.
      loadIpc()
      Menu.setApplicationMenu(appMenu)
      if (IS_MAC) app.dock.setMenu(dockMenu)

      // Load the React Devtools extension.
      // https://github.com/BlackHole1/electron-devtools-vendor#usage
      if (IS_DEV) {
        let { REACT_DEVELOPER_TOOLS } = require('electron-devtools-vendor')
        await session.defaultSession.loadExtension(REACT_DEVELOPER_TOOLS, {
          allowFileAccess: true,
        })
      }

      // Try to restore any saved windows.
      this.restore()

      // If there is still no active window, create one.
      if (!Window.byActive()) {
        let window = Window.create()
        window.show()
      }

      // If there is a file path with the process, open it.
      // if (process.argv.length >= 2) {
      //   let path = process.argv[1]
      //   this.openFile(path)
      // }
    })

    // On macOS, this fires when clicking the dock icon.
    app.on('activate', () => {
      log.info('Received `activated` event')
      let window = Window.byActive()
      if (window) {
        window.focus()
      } else {
        let window = Window.create()
        window.show()
      }
    })

    app.on('open-file', async (e, path) => {
      log.info('Received `open-file` event')
      e.preventDefault()
      await app.whenReady()
      let window = Window.byFocused() ?? Window.create()
      window.openTab(path)
      window.show()
    })

    app.on('before-quit', () => {
      log.info('Received `before-quit` event')
      this.isQuitting = true
    })

    app.on('quit', () => {
      log.info('Received `quit` event')
      this.isQuitting = false
    })

    // On macOS, don't quit when all windows are closed.
    app.on('window-all-closed', () => {
      log.info('Received `window-all-closed` event')
      if (!IS_MAC) this.quit()
    })
  }

  /**
   * Getters & setters.
   */

  /** Get the main store's current state. */
  get store() {
    return this.#shared.get()
  }

  /** Set the main store's state using an Immer `recipe` function. */
  change(recipe: (draft: Draft<StoreState>) => void): void {
    return this.#shared.change(recipe)
  }

  /**
   * Actions.
   */

  /** Clear the persistent storage. */
  clear() {
    log.info('Clearing storage…')
    this.#store.clear()
  }

  /** Open sketches with the active window, or create a new one. */
  async open() {
    log.info('Showing open files dialog…')
    let result = await dialog.showOpenDialog({
      properties: ['openFile', 'multiSelections'],
    })

    let window = Window.byFocused() ?? Window.create()
    for (let path of result.filePaths) {
      window.openTab(path)
    }
    window.show()
  }

  /** Quit the app. */
  quit() {
    log.info('Quitting…')
    app.quit()
  }

  /** Restore any saved windows. */
  restore() {
    for (let id in this.store.windows) {
      log.info('Restoring window…', { id })
      let window = Window.restore(id)
      window.show()
    }
  }

  /** Restart an app after exiting. */
  restart() {
    log.info('Restarting app…')
    app.relaunch()
    this.quit()
  }
}

/** Create a singleton `Main` instance. */
export let main = new Main()
