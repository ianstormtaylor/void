import Path from 'path'
import { BrowserWindow, dialog } from 'electron'
import { IS_DEV, VITE_DEV_SERVER_URL } from '../shared/env'
import { Tab } from './tab'
import { store } from './store'
import crypto from 'node:crypto'
import { STATUS } from './status'

/** References to all the open windows by ID. */
let WINDOWS: Record<string, Window> = {}

/** A JSON representation of a `Window`. */
export type WindowJSON = {
  id: string
}

/** A `Window` class to hold state for a series of tabs. */
export class Window {
  id: string
  browserWindow: BrowserWindow

  /** Create a new window. */
  constructor(
    props: { activeTabId?: string; tabIds?: string[]; id?: string } = {}
  ) {
    let { id = crypto.randomUUID(), activeTabId = null, tabIds = [] } = props
    let win = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1250,
      height: 750,
      // titleBarStyle: 'hidden',
      webPreferences: {
        preload: Path.join(__dirname, '../preload/index.js'),
        // nodeIntegration: true,
        // contextIsolation: false,
        // webviewTag: true,
      },
    })

    // Load the entrypoint to the Vite dev server.
    let url = `${VITE_DEV_SERVER_URL}/windows/${id}`
    win.loadURL(url)
    if (IS_DEV) win.webContents.openDevTools()

    this.id = id
    this.browserWindow = win

    // Add the new window to the shared store.
    store.setState((s) => {
      s.windows[id] = { id, activeTabId, tabIds }
    })

    win.on('closed', () => this.close({ persist: STATUS.quitting }))
    WINDOWS[id] = this
  }

  /** Get the active (or most recently active) window. */
  static active(): Window {
    return Object.values(WINDOWS)[0]
  }

  /** Get all the open windows. */
  static all(): Window[] {
    return Object.values(WINDOWS)
  }

  /** Get a window by `id`. */
  static get(id: string): Window {
    return WINDOWS[id]
  }

  /** Get the tabs of a window by `id`. */
  static tabs(id: string): Tab[] {
    let state = store.getState()
    let w = state.windows[id]
    return Tab.all().filter((t) => w.tabIds.includes(t.id))
  }

  /** Prompt to open a sketch file or directory. */
  async openTabs() {
    let result = await dialog.showOpenDialog({ properties: ['openFile'] })
    if (result.filePaths.length === 0) return

    let tabs = result.filePaths.map((path) => new Tab({ path }))
    store.setState((s) => {
      let w = s.windows[this.id]
      w.tabIds = w.tabIds.concat(tabs.map((t) => t.id))
    })

    let last = tabs.at(-1)
    this.activateTab(last.id)
  }

  /** Activate a tab in the window by `id`. */
  activateTab(id: string) {
    let tab = Tab.get(id)
    if (!tab) return
    let view = tab.browserView
    let { x, y, width, height } = this.browserWindow.getBounds()
    let padding = 40 + 3 // not quite exact for some reason
    this.browserWindow.setBrowserView(view)
    view.setBounds({ x, y: y + padding, width, height: height - padding })
    view.setAutoResize({ width: true, height: true })
    store.setState((s) => {
      let w = s.windows[this.id]
      w.activeTabId = tab.id
    })
  }

  /** Close the window. */
  close(options: { persist?: boolean } = {}) {
    console.log('Closing window…', this.id, options)

    for (let tab of Window.tabs(this.id)) {
      tab.close(options)
    }

    if (!options.persist) {
      store.setState((s) => {
        delete s.windows[this.id]
      })
    }

    delete WINDOWS[this.id]
  }
}
