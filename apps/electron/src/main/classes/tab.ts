import Path from 'path'
import crypto from 'node:crypto'
import { BrowserView } from 'electron'
import { RENDERER_URL } from '../env'
import { Window } from './window'
import { main } from './main'
import { Draft } from 'immer'
import { TabState } from '../../shared/store-state'
import { Entrypoint } from './entrypoint'

/** A `Tab` class holds a reference to a specific sketch file. */
export class Tab {
  id: string
  view: BrowserView

  /** Construct a new `Tab` instance with `id`.. */
  constructor(id: string) {
    let preload = Path.resolve(__dirname, '../preload/index.js')
    let url = `${RENDERER_URL}#/tabs/${id}`
    let view = new BrowserView({ webPreferences: { preload } })
    this.id = id
    this.view = view
    view.webContents.loadURL(url)
  }

  /**
   * Statics.
   */

  /** Create a new `Tab` with a sketch file `path`. */
  static create(path: string): Tab {
    let entrypoint = Entrypoint.load(path)
    let id = crypto.randomUUID()
    main.change((m) => {
      m.tabs[id] = {
        id,
        entrypointId: entrypoint.id,
        zoom: null,
        seed: 1,
        config: {},
        traits: {},
        layers: {},
      }
    })

    let tab = new Tab(id)
    main.tabs[id] = tab
    return tab
  }

  /** Restore a saved tab by `id`. */
  static restore(id: string): Tab {
    let t = main.store.tabs[id]
    if (!t) throw new Error(`Cannot restore unknown tab: ${id}`)
    Entrypoint.restore(t.entrypointId)
    let tab = new Tab(id)
    main.tabs[id] = tab
    return tab
  }

  /** Get all the open tabs. */
  static all(): Tab[] {
    return Object.values(main.tabs)
  }

  /** Get the active tab in the active window. */
  static byActive(): Tab | null {
    let window = Window.byActive()
    if (!window || !window.activeTabId) return null
    let tab = Tab.byId(window.activeTabId)
    return tab
  }

  /** Get a tab by `id`. */
  static byId(id: string): Tab {
    let tab = main.tabs[id]
    if (!tab) throw new Error(`Cannot find tab by id: "${id}"`)
    return tab
  }

  /** Get a tab by `senderId`. */
  static bySenderId(senderId: number): Tab {
    let tab = Tab.all().find((t) => t.senderId === senderId)
    if (!tab) throw new Error(`Cannot find tab by sender id: ${senderId}`)
    return tab
  }

  /**
   * Getters & setters.
   */

  /** The electron tab's `webContents` id, for IPC messages. */
  get senderId(): number {
    return this.view.webContents.id
  }

  /** Get the tab's path. */
  get entrypoint() {
    return main.entrypoints[this.entrypointId]
  }

  /** Get the tab's entrypoint ID. */
  get entrypointId() {
    return main.store.tabs[this.id].entrypointId
  }

  /** Get the tab's parent `Window`. */
  get window() {
    let windows = Window.all()
    let window = windows.find((w) => w.tabIds.includes(this.id))
    if (!window) throw new Error(`Cannot find window for tab: ${this.id}`)
    return window
  }

  /** Update the tab's immutable state with an Immer `recipe` function. */
  change(recipe: (draft: Draft<TabState>) => void): void {
    return main.change((s) => {
      recipe(s.tabs[this.id])
    })
  }

  /**
   * Actions.
   */

  /** Close the tab. */
  close(options: { save?: boolean } = {}) {
    let { id, entrypoint } = this

    // If this is the only active tab for the entrypoint, shut it down too.
    if (entrypoint.tabs.length == 1) {
      entrypoint.close()
    }

    if (!options.save) {
      main.change((s) => {
        delete s.tabs[id]
      })
    }

    delete main.tabs[id]
  }

  /** Open the devtools inspector for the tab. */
  inspect() {
    let w = this.view.webContents
    if (w.isDevToolsOpened()) w.closeDevTools()
    w.openDevTools()
  }

  /** Reload the tab. */
  reload() {
    console.log('Reloading tab…', this.id)
    this.view.webContents.reload()
  }
}
