import Path from 'path'
import { BrowserView } from 'electron'
import { serve, ServeResult } from 'esbuild'
import { IS_DEV, VITE_DEV_SERVER_URL } from '../shared/env'
import { Window } from './window'
import { store } from './store'
import crypto from 'node:crypto'

/** References to all the open tabs. */
let TABS: Record<string, Tab> = {}

/** A `Tab` class holds a reference to a specific sketch file. */
export class Tab {
  id: string
  path: string
  browserView: BrowserView
  server?: ServeResult
  entrypoint?: string

  /** Create a new `Tab` with sketch `path`. */
  constructor(props: { path: string; id?: string }) {
    let { path, id = crypto.randomUUID() } = props
    let view = new BrowserView({
      webPreferences: {
        preload: Path.join(__dirname, '../preload/index.js'),
        // nodeIntegration: true,
        // contextIsolation: false,
      },
    })

    let url = `${VITE_DEV_SERVER_URL}/tabs/${id}`
    view.webContents.loadURL(url)
    if (IS_DEV) view.webContents.openDevTools()

    this.browserView = view
    this.id = id
    this.path = path

    TABS[id] = this
    this.start()
    store.setState((s) => {
      s.tabs[id] = {
        id,
        path,
        entrypoint: null,
      }
    })
  }

  /** Get a tab by `id`. */
  static get(id: string): Tab {
    let tab = TABS[id]
    if (!tab) throw new Error(`Could not find Tab by id: "${id}"`)
    return tab
  }

  /** Get all the open tabs. */
  static all(): Tab[] {
    return Object.values(TABS)
  }

  /** Serve the sketch's entrypoint with esbuild from memory. */
  async start() {
    let { id, path } = this
    let dir = Path.dirname(path)
    let file = `${Path.basename(path, Path.extname(path))}.js`
    let server = await serve(
      { servedir: dir },
      {
        entryPoints: [path],
        outdir: dir,
        bundle: true,
        sourcemap: true,
        format: 'esm',
        footer: {
          js: `
            // Expose top-level properties of sketches.
            export default {
              settings: typeof settings === 'undefined' ? null : settings,
              sketch: typeof sketch === 'undefined' ? null : sketch,
              draw: typeof draw === 'undefined' ? null : draw,
              setup: typeof setup === 'undefined' ? null : setup,
            }
          `,
        },
      }
    )

    let entrypoint = `http://localhost:${server.port}/${file}`
    this.entrypoint = entrypoint
    this.server = server

    setImmediate(() => {
      store.setState((s) => {
        s.tabs[id].entrypoint = entrypoint
      })
    })
  }

  /** Close the tab. */
  close(options: { persist?: boolean } = {}) {
    if (!options.persist) {
      store.setState((s) => {
        delete s.tabs[this.id]
      })
    }

    if (this.server) {
      this.server.stop()
      this.server = null
    }

    delete TABS[this.id]
  }
}
