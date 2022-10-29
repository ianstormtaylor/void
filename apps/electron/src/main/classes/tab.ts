import Path from 'path'
import crypto from 'node:crypto'
import { app, BrowserView } from 'electron'
import { RENDERER_URL } from '../env'
import { Window } from './window'
import { main } from './main'
import { Draft } from 'immer'
import { TabState } from '../../shared/store-state'
import { Sketch } from './sketch'

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
    let sketch = Sketch.load(path)
    let id = crypto.randomUUID()
    main.change((m) => {
      m.tabs[id] = {
        id,
        sketchId: sketch.id,
        inspecting: false,
        zoom: null,
        config: {},
        traits: {},
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
    Sketch.restore(t.sketchId)
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

  /** Get the tab's inspecting state. */
  get inspecting() {
    return main.store.tabs[this.id].inspecting
  }

  /** The electron tab's `webContents` id, for IPC messages. */
  get senderId(): number {
    return this.view.webContents.id
  }

  /** Get the tab's path. */
  get sketch() {
    return main.sketches[this.sketchId]
  }

  /** Get the tab's sketch ID. */
  get sketchId() {
    return main.store.tabs[this.id].sketchId
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
    let { id, sketch } = this

    // If this is the only active tab for the sketch, shutdown the sketch too.
    if (sketch.tabs.length == 1) {
      sketch.close()
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
    this.view.webContents.toggleDevTools()
    this.change((t) => {
      t.inspecting = this.view.webContents.isDevToolsOpened()
    })
  }

  /** Reload the tab. */
  reload() {
    console.log('Reloading tab…', this.id)
    this.view.webContents.reload()
  }
}
