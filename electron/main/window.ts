import Path from 'path'
import { BrowserWindow, dialog } from 'electron'
import { IS_DEV, VITE_DEV_SERVER_URL } from './env'
import { Tab } from './tab'
import { store } from './store'
import crypto from 'node:crypto'

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
  constructor(id = crypto.randomUUID()) {
    console.log('Constructing window…', id)
    let browserWindow = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1250,
      height: 750,
      // titleBarStyle: 'hidden',
      webPreferences: {
        preload: Path.join(__dirname, '../preload/index.js'),
        nodeIntegration: true,
        contextIsolation: false,
        webviewTag: true,
      },
    })

    // Load the entrypoint to the Vite dev server.
    browserWindow.loadURL(VITE_DEV_SERVER_URL)
    if (IS_DEV) browserWindow.webContents.openDevTools()

    // Save a reference to the window for later, and cleanup on close.
    WINDOWS[id] = this
    browserWindow.on('closed', () => delete WINDOWS[this.id])

    this.id = id
    this.browserWindow = browserWindow

    // Add the new window to the shared store.
    store.setState((s) => {
      s.windows[id] = { id }
    })
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
    return Tab.all().filter((t) => t.windowId === id)
  }

  /** Prompt to open a sketch file or directory. */
  async openFile() {
    let result = await dialog.showOpenDialog({ properties: ['openFile'] })

    for (let path of result.filePaths) {
      let tab = new Tab(this, path)
      let view = tab.browserView
      let { x, y, width, height } = this.browserWindow.getBounds()
      let padding = 40 + 3 // not quite exact for some reason
      this.browserWindow.setBrowserView(view)
      view.setBounds({ x, y: y + padding, width, height: height - padding })
      view.setAutoResize({ width: true, height: true })
    }
  }

  /** Send a message to the window and all its tabs. */
  send(event: string, ...args: any[]) {
    this.browserWindow.webContents.send(event, ...args)

    for (let tab of Window.tabs(this.id)) {
      tab.browserView.webContents.send(event, ...args)
    }
  }
}
