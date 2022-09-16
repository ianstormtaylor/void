import { BrowserWindow } from 'electron'
import Path from 'path'
import { serve, ServeResult } from 'esbuild'
import fs from 'fs'
import { IS_DEV, VITE_DEV_SERVER_HOST, VITE_DEV_SERVER_PORT } from './env'

/** References to all the open windows by ID. */
let WINDOWS: Record<number, Window> = {}

/** The footer that we inject to capture sketch exports. */
let FOOTER = fs.readFileSync(
  Path.resolve(__dirname, '../../../electron/main/footer.js'),
  'utf-8'
)

/** A `Window` class to hold state for the opened sketch. */
export class Window {
  id: number
  tmp: string
  path: string
  stat: fs.Stats
  isFile: boolean
  isDir: boolean
  browser: BrowserWindow
  server: ServeResult | null
  entrypoint: string | null

  /** Get a window by `id`. */
  static get(id: number): Window {
    return WINDOWS[id]
  }

  /** Get all the current windows. */
  static all(): Window[] {
    return Object.values(WINDOWS)
  }

  /** Create a new window with a sketch `path`. */
  constructor(path: string) {
    console.log('constructing window…')
    this.server = null
    this.path = path
    this.stat = fs.statSync(path)
    this.isFile = this.stat.isFile()
    this.isDir = this.stat.isDirectory()

    // Create a new Electron browser window.
    this.browser = new BrowserWindow({
      x: 0,
      y: 0,
      width: 1250,
      titleBarStyle: 'hidden',
      height: 750,
      webPreferences: {
        preload: Path.join(__dirname, '../preload/index.js'),
        nodeIntegration: true,
        contextIsolation: false,
      },
    })

    // Load the entrypoint to the Vite dev server.
    let url = `http://${VITE_DEV_SERVER_HOST}:${VITE_DEV_SERVER_PORT}`
    this.browser.loadURL(url)
    if (IS_DEV) this.browser.webContents.openDevTools()

    // Save a reference to the window for later, and cleanup on close.
    this.id = this.browser.webContents.id
    WINDOWS[this.id] = this
    this.browser.on('closed', () => {
      if (this.server) this.server.stop()
      delete WINDOWS[this.id]
    })

    // Serve the sketch's entrypoint with esbuild from memory.
    console.log('esbuilding…', this.path)
    let dir = Path.dirname(this.path)
    let file = `${Path.basename(this.path, Path.extname(this.path))}.js`
    serve(
      {
        servedir: dir,
      },
      {
        entryPoints: [this.path],
        outdir: dir,
        bundle: true,
        sourcemap: true,
        format: 'esm',
        footer: { js: FOOTER },
      }
    ).then((server) => {
      this.server = server
      this.entrypoint = `http://${server.host}:${server.port}/${file}`
    })
  }
}
