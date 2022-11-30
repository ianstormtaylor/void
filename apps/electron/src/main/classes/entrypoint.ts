import Path from 'path'
import crypto from 'node:crypto'
import Esbuild from 'esbuild-wasm'
import Fs from 'fs'
import Http from 'http'
import { temporaryDirectory } from 'tempy'
import { main } from './main'
import { Draft } from 'immer'
import { EntrypointState } from '../../shared/store-state'
import { Tab } from './tab'
import log from 'electron-log'

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
        timestamp: null,
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
      log.info('Already serving the sketch, returning early')
      return
    }

    let { id, path } = this
    let file = Path.basename(path, Path.extname(path))
    let jsFile = `${file}.js`
    let tmpdir = temporaryDirectory()
    let failure: Esbuild.BuildFailure | undefined
    log.info('Serving entrypoint…', { id, path, tmpdir })

    try {
      this.#watcher = await Esbuild.build({
        entryPoints: [path],
        outdir: tmpdir,
        write: false,
        watch: {
          onRebuild: (error) => {
            if (error) {
              log.error('Esbuild watcher error', { id, path, error })
            } else {
              log.info('Esbuild watcher rebuild', { id, path })
            }

            this.change((e) => {
              e.timestamp = Date.now()
            })
          },
        },
      })
    } catch (e) {
      log.error('Esbuild failure', { id, path, error: e })
      failure = e as Esbuild.BuildFailure
    }

    this.#server = Http.createServer(async (req, res) => {
      if (!req.url) return
      let { url, headers } = req
      log.info('Incoming entrypoint server request…', {
        id,
        path,
        url,
        headers,
      })

      let { pathname } = new URL(`http://${headers.host}${url}`)
      let route = pathname.slice(1)
      let isJs = pathname === `/${jsFile}`

      if (route === 'esbuild-errors') {
        log.info('Handling esbuild build-time errors request…')
        res.statusCode = 200
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Content-Type', 'application/json')
        res.write(JSON.stringify(failure?.errors ?? []))
        res.end()
      }

      if (!pathname.startsWith(`/${jsFile}`)) {
        log.error('Requested file not found', { id, path, url, headers })
        res.statusCode = 404
        res.end()
        return
      }

      try {
        if (this.#builder) {
          log.info('Rebuilding with esbuild…', { id, path })
          await this.#builder.rebuild!()
        } else {
          log.info('Starting esbuild…', { id, path })
          this.#builder = await Esbuild.build({
            entryPoints: [path],
            outdir: tmpdir,
            bundle: true,
            sourcemap: true,
            sourceRoot: path,
            incremental: true,
            format: 'esm',
          })
        }
      } catch (e) {
        log.error('Esbuild building error', { id, path, error: e })
        failure = e as Esbuild.BuildFailure
        res.statusCode = 500
        res.end()
        return
      }

      log.info('Handling esbuild request…', { id, path })
      res.statusCode = 200
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Content-Type', isJs ? 'text/javascript' : 'text/plain')
      let outfile = Path.resolve(tmpdir, route)
      let stream = Fs.createReadStream(outfile)
      stream.pipe(res, { end: true })
    })

    this.#server.listen()
    let { port } = this.#server.address() as any
    setImmediate(() => {
      this.change((e) => {
        e.url = `http://localhost:${port}/${jsFile}`
        e.timestamp = Date.now()
      })
    })
  }

  /** Shutdown the entrypoint's server. */
  close() {
    log.info('Closing entrypoint…', { id: this.id, path: this.path })
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
