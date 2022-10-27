import Path from 'path'
import crypto from 'node:crypto'
import { app, BrowserWindow } from 'electron'
import { RENDERER_URL } from '../env'
import { Tab } from './tab'
import { main } from './main'
import { Draft } from 'immer'
import { WindowState } from '../../shared/store-state'

/** A `Window` class to hold state for a series of tabs. */
export class Window {
  /** A unique (persistable) identifier for the window. */
  id: string

  /** A private reference to the Electron window. */
  #window: BrowserWindow

  /** Create a new window. */
  constructor(id: string) {
    let preload = Path.resolve(__dirname, '../preload/index.js')
    let url = `${RENDERER_URL}#/windows/${id}`
    let window = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1250,
      height: 750,
      show: false,
      titleBarStyle: 'hiddenInset',
      trafficLightPosition: { x: 12, y: 12 },
      webPreferences: { preload },
    })

    this.id = id
    this.#window = window

    window.on('closed', () => {
      this.close({ save: main.isQuitting })
    })

    window.on('resize', () => {
      let bounds = this.#window.getBounds()
      this.change((w) => {
        w.x = bounds.x
        w.y = bounds.y
        w.width = bounds.width
        w.height = bounds.height
      })
      this.resizeView()
    })

    window.on('moved', () => {
      let [x, y] = this.#window.getPosition()
      this.change((w) => {
        w.x = x
        w.y = y
      })
    })

    window.loadURL(url)
  }

  /**
   * Statics.
   */

  /** Create a new `Window`. */
  static create(): Window {
    let id = crypto.randomUUID()
    main.change((s) => {
      s.windows[id] = {
        id,
        tabIds: [],
        activeTabId: null,
        x: 0,
        y: 0,
        width: 1200,
        height: 750,
      }
    })

    let window = new Window(id)
    main.windows[id] = window
    return window
  }

  /** Restore a saved window by `id`. */
  static restore(id: string): Window {
    let w = main.store.windows[id]
    if (!w) throw new Error(`Cannot restore unknown window: ${id}`)

    let window = new Window(id)
    main.windows[id] = window

    for (let tid of w.tabIds) {
      Tab.restore(tid)
    }

    if (w.activeTabId) window.activateTab(w.activeTabId)
    return window
  }

  /** Get all the windows. */
  static all(): Window[] {
    return Object.values(main.windows)
  }

  static getFocused(): Window | null {
    let focused = BrowserWindow.getFocusedWindow()
    if (!focused) return null
    let window = Window.bySenderId(focused.webContents.id)
    return window
  }

  /** Get the active (or most recently active) window. */
  static byActive(): Window | null {
    return Window.all()[0] ?? null
  }

  /** Get a window by `id`. */
  static byId(id: string): Window {
    return main.windows[id]
  }

  /** Get a window by `senderId`. */
  static bySenderId(senderId: number): Window {
    let window = Window.all().find((w) => w.senderId === senderId)
    let tab = Tab.all().find((t) => t.senderId === senderId)
    if (!window) window = tab?.window
    if (!window) throw new Error(`Cannot find window by sender id: ${senderId}`)
    return window
  }

  /**
   * Getters & setters.
   */

  /** Get the active `Tab` instance of a window. */
  get activeTab(): Tab | null {
    let id = this.activeTabId
    return id ? Tab.byId(id) : null
  }

  /** Get the `activeTabId` of the window. */
  get activeTabId(): string | null {
    return main.store.windows[this.id].activeTabId
  }

  /** Get the windows bounds. */
  get bounds(): { x: number; y: number; width: number; height: number } {
    let { x, y, width, height } = main.store.windows[this.id]
    return { x, y, width, height }
  }

  /** The electron window's `webContents` id, for IPC messages. */
  get senderId(): number {
    return this.#window.webContents.id
  }

  /** Get the child `Tab` instances of a window. */
  get tabs(): Tab[] {
    return this.tabIds.map((id) => Tab.byId(id))
  }

  /** Get the child `tabIds` of a window. */
  get tabIds(): string[] {
    return main.store.windows[this.id].tabIds
  }

  /** Set the window's state using an Immer `recipe` function. */
  change(recipe: (draft: Draft<WindowState>) => void): void {
    main.change((m) => {
      recipe(m.windows[this.id])
    })
  }

  /**
   * Actions.
   */

  /** Activate a tab by `id` in the window. */
  activateTab(tabId: string) {
    let tab = Tab.byId(tabId)
    this.#window.setBrowserView(tab.view)
    this.resizeView()
    this.change((w) => {
      w.activeTabId = tab.id
    })
  }

  /** Attach an existing tab to the window. */
  attachTab(tabId: string) {
    this.change((w) => {
      if (!w.tabIds.includes(tabId)) {
        w.tabIds.push(tabId)
      }
    })
  }

  /** Close the window. */
  close(options: { save?: boolean } = {}) {
    for (let tab of this.tabs) {
      tab.close(options)
    }

    if (!options.save) {
      main.change((s) => {
        delete s.windows[this.id]
      })
    }

    delete main.windows[this.id]
  }

  /** Close one of the window's tabs. */
  closeTab(tabId: string) {
    let tab = Tab.byId(tabId)
    this.detachTab(tab.id)
    tab.close()
  }

  /** Detach a tab from the window, without closing it. */
  detachTab(tabId: string) {
    let index = this.tabIds.indexOf(tabId)
    if (index == -1)
      throw new Error(`Cannot detach tab that isn't attached: ${tabId}`)

    this.change((w) => {
      w.tabIds.splice(index, 1)
    })

    let { tabIds } = this
    let nextId = tabIds[index] ?? tabIds[index - 1] ?? tabIds[0]

    if (nextId) {
      this.activateTab(nextId)
    } else {
      this.#window.setBrowserView(null)
      this.change((w) => {
        w.activeTabId = null
      })
    }
  }

  /** Focus the window. */
  focus() {
    this.#window.focus()
  }

  /** Hide the window. */
  hide() {
    this.#window.hide()
  }

  /** Toggle the developer tools for the window. */
  inspect() {
    this.#window.webContents.toggleDevTools()
  }

  /** Open a sketch `path` in a new tab in the window. */
  openTab(path: string): Tab {
    let tab = Tab.create(path)
    this.attachTab(tab.id)
    this.activateTab(tab.id)
    return tab
  }

  /** Reload the window. */
  reload() {
    this.#window.reload()
  }

  /** Resize the current tab's view to match the window size. */
  resizeView() {
    let view = this.#window.getBrowserView()
    if (!view) return
    let { width, height } = this.#window.getBounds()
    let padding = 40
    view.setBounds({ x: 0, y: padding, width, height: height - padding })
  }

  /** Show the window. */
  show() {
    this.#window.setBounds(this.bounds)
    this.#window.show()
    this.resizeView() // compat: required to keep the view aligned
  }
}
