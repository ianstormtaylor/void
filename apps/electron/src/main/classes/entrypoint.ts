import Path from 'path'
import crypto from 'node:crypto'
import Esbuild from 'esbuild'
import Fs from 'fs'
import Http from 'http'
import { temporaryDirectory } from 'tempy'
import { main } from './main'
import { Draft } from 'immer'
import { EntrypointState } from '../../shared/store-state'
import { Tab } from './tab'

/** A `Entrypoint` class holds a reference to a specific sketch file. */
export class Entrypoint {
  id: string
  #builder: Esbuild.BuildResult | null
  #watcher: Esbuild.BuildResult | null
  #server: Http.Server | null

  /** Constructor a new `Entrypoint` instance by `id`. */
  constructor(id: string) {
    this.id = id
    this.#builder = null
    this.#watcher = null
    this.#server = null
    this.serve()
  }

  /**
   * Statics.
   */

  /** Load an entrypoint by `path`, reusing an existing one if possible. */
  static load(path: string): Entrypoint {
    let match = Object.values(main.entrypoints).find((s) => s.path === path)
    if (match) {
      match.serve()
      return match
    }

    let s = Object.values(main.store.entrypoints).find((s) => s.path === path)
    if (s) return Entrypoint.restore(s.id)

    let id = crypto.randomUUID()
    main.change((m) => {
      m.entrypoints[id] = {
        id,
        path,
        url: null,
      }
    })
    let entrypoint = new Entrypoint(id)
    main.entrypoints[id] = entrypoint
    return entrypoint
  }

  /** Restore a saved entrypoint. */
  static restore(id: string): Entrypoint {
    let s = main.store.entrypoints[id]
    if (!s) throw new Error(`Cannot restore unknown entrypoint: ${id}`)
    let entrypoint = new Entrypoint(id)
    main.entrypoints[id] = entrypoint
    return entrypoint
  }

  /**
   * Getters & setters.
   */

  /** Get the entrypoint's URL. */
  get url(): string | null {
    return main.store.entrypoints[this.id].url
  }

  /** Get the entrypoint's path. */
  get path(): string {
    return main.store.entrypoints[this.id].path
  }

  /** Get the entrypoint's open tabs. */
  get tabs(): Tab[] {
    return Object.values(main.store.tabs)
      .filter((t) => t.entrypointId == this.id)
      .map((t) => main.tabs[t.id])
  }

  /** Update the entrypoint's immutable state with an Immer `recipe` function. */
  change(recipe: (draft: Draft<EntrypointState>) => void): void {
    return main.change((s) => {
      recipe(s.entrypoints[this.id])
    })
  }

  /**
   * Actions.
   */

  /** Serve the entrypoint with esbuild from memory. */
  async serve() {
    if (this.#builder || this.#watcher || this.#server) {
      console.log('Already serving the sketch, returning early.')
      return
    }

    let { path } = this
    let file = Path.basename(path, Path.extname(path))
    let jsFile = `${file}.js`
    let outdir = temporaryDirectory()
    let builder: Esbuild.BuildResult

    // Start a build process to watch for reloading.
    this.#watcher = await Esbuild.build({
      entryPoints: [path],
      outdir,
      write: false,
      watch: {
        onRebuild: (error) => {
          if (error) console.error('Esbuild watch error:', error)
          for (let tab of this.tabs) {
            tab.reload()
          }
        },
      },
    })

    let server = (this.#server = Http.createServer(async (req, res) => {
      if (!req.url) return
      let { pathname } = new URL(`http://${req.headers.host}${req.url}`)
      let route = pathname.slice(1)
      let isJs = pathname === `/${jsFile}`

      if (route === 'esbuild-errors') {
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(builder?.errors ?? []))
        res.end()
      }

      if (!pathname.startsWith(`/${jsFile}`)) {
        console.error('not found', route)
        res.statusCode = 404
        res.end()
        return
      }

      try {
        if (builder != null) {
          builder.rebuild!()
        } else {
          builder ??= this.#builder = await Esbuild.build({
            entryPoints: [path],
            outdir,
            bundle: true,
            sourcemap: true,
            sourceRoot: path,
            incremental: true,
            format: 'esm',
          })
        }
      } catch (e) {
        res.statusCode = 500
        res.end()
        return
      }

      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', isJs ? 'text/javascript' : 'text/plain')
      let outfile = Path.resolve(outdir, route)
      let stream = Fs.createReadStream(outfile)
      stream.pipe(res, { end: true })
    }))

    server.listen()
    let { port } = server.address() as any
    setImmediate(() => {
      this.change((t) => {
        t.url = `http://localhost:${port}/${jsFile}`
      })
    })
  }

  /** Shutdown the entrypoint's server. */
  close() {
    if (this.#watcher && this.#watcher.stop != null) {
      this.#watcher.stop()
    }

    if (this.#builder && this.#builder.stop != null) {
      this.#builder.rebuild!.dispose()
    }

    if (this.#server) {
      this.#server.close()
    }

    this.#builder = null
    this.#watcher = null
    this.#server = null
  }
}
