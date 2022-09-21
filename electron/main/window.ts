import Path from 'path'
import { BrowserWindow, dialog } from 'electron'
import { IS_DEV, VITE_DEV_SERVER_URL } from '../shared/env'
import { Tab } from './tab'
import { store } from './store'
import crypto from 'node:crypto'
import { main } from './main'

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
      show: false,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 12, y: 12 },
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

    win.on('closed', () => {
      this.close({ persist: main.isQuitting })
    })

    win.on('resize', () => {
      // let view = win.getBrowserView()
      // view.setBounds(view.getBounds())
      this.resizeView()
    })

    WINDOWS[id] = this
  }

  /** Get the active (or most recently active) window. */
  static active(): Window | null {
    return Object.values(WINDOWS)[0] ?? null
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

  /** Add `tabs` to the window. */
  addTabs(tabs: Tab[]) {
    store.setState((s) => {
      let w = s.windows[this.id]
      w.tabIds = w.tabIds.concat(tabs.map((t) => t.id))
    })
  }

  /** Activate a tab by `id` in the window. */
  activateTab(id: string) {
    let tab = Tab.get(id)
    let view = tab.browserView
    this.browserWindow.setBrowserView(view)
    this.resizeView()
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

  resizeView() {
    let view = this.browserWindow.getBrowserView()
    let { x, y, width, height } = this.browserWindow.getBounds()
    let padding = 15 // not quite exact for some reason
    view.setBounds({ x, y: y + padding, width, height: height - padding })
  }

  /** Close a tab by `id` in the window. */
  closeTab(id: string) {
    let tab = Tab.get(id)
    let nextId: string | undefined

    store.setState((s) => {
      let w = s.windows[this.id]
      let index = w.tabIds.findIndex((i) => i == tab.id)
      if (index === -1) return
      w.tabIds.splice(index, 1)
      if (tab.id === w.activeTabId) {
        nextId = w.tabIds[index] || w.tabIds[index - 1] || w.tabIds[0]
        w.activeTabId = nextId
      }
    })

    if (nextId) {
      this.activateTab(nextId)
    }

    tab.close()
  }

  /** Show the window. */
  show() {
    this.browserWindow.show()
  }

  /** Hide the window. */
  hide() {
    this.browserWindow.hide()
  }

  /** Focus the window. */
  focus() {
    this.browserWindow.focus()
  }
}
