import Path from 'path'
import crypto from 'node:crypto'
import Esbuild from 'esbuild'
import { main } from './main'
import { Draft } from 'immer'
import { EntrypointState } from '../../shared/store-state'
import { Tab } from './tab'

/** A `Entrypoint` class holds a reference to a specific sketch file. */
export class Entrypoint {
  id: string
  #build: Esbuild.BuildResult | null
  #serve: Esbuild.ServeResult | null

  /** Constructor a new `Entrypoint` instance by `id`. */
  constructor(id: string) {
    this.id = id
    this.#build = null
    this.#serve = null
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
    if (this.#build || this.#serve) {
      console.log('Already serving the sketch, returning early.')
      return
    }

    let { id, path } = this
    let dir = Path.dirname(path)
    let file = `${Path.basename(path, Path.extname(path))}.js`

    // Start a build process to watch for reloading.
    let build = await Esbuild.build({
      entryPoints: [path],
      outdir: dir,
      write: false,
      watch: {
        onRebuild: (error) => {
          if (error) {
            console.error('Esbuild watch error:', error)
          }
          for (let tab of this.tabs) {
            tab.reload()
          }
        },
      },
    })

    // Start a serve process to serve the sketch files.
    let serve = await Esbuild.serve(
      { servedir: dir },
      {
        entryPoints: [path],
        outdir: dir,
        bundle: true,
        sourcemap: true,
        format: 'esm',
      }
    )

    this.#build = build
    this.#serve = serve

    setImmediate(() => {
      this.change((t) => {
        t.url = `http://localhost:${serve.port}/${file}`
      })
    })
  }

  /** Shutdown the entrypoint's server. */
  close() {
    if (this.#build && this.#build.stop != null) this.#build.stop()
    if (this.#serve) this.#serve.stop()
    this.#build = null
    this.#serve = null
  }
}
