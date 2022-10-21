import Path from 'path'
import crypto from 'node:crypto'
import Esbuild from 'esbuild'
import { main } from './main'
import { Draft } from 'immer'
import { SketchConfig } from '../../shared/config'
import { Tab } from './tab'

/** A `Sketch` class holds a reference to a specific sketch file. */
export class Sketch {
  id: string
  #build: Esbuild.BuildResult | null
  #serve: Esbuild.ServeResult | null

  /** Constructor a new `Sketch` instance by `id`. */
  constructor(id: string) {
    this.id = id
    this.#build = null
    this.#serve = null
    this.serve()
  }

  /**
   * Statics.
   */

  /** Load a sketch by `path`, reusing an existing one if possible. */
  static load(path: string): Sketch {
    let match = Object.values(main.sketches).find((s) => s.path === path)
    if (match) {
      match.serve()
      return match
    }

    let s = Object.values(main.store.sketches).find((s) => s.path === path)
    if (s) return Sketch.restore(s.id)

    let id = crypto.randomUUID()
    main.change((m) => {
      m.sketches[id] = {
        id,
        path,
        entrypoint: null,
      }
    })
    let sketch = new Sketch(id)
    main.sketches[id] = sketch
    return sketch
  }

  /** Restore a saved sketch. */
  static restore(id: string): Sketch {
    let s = main.store.sketches[id]
    if (!s) throw new Error(`Cannot restore unknown sketch: ${id}`)
    let sketch = new Sketch(id)
    main.sketches[id] = sketch
    return sketch
  }

  /**
   * Getters & setters.
   */

  /** Get the sketch's entrypoint URL. */
  get entrypoint(): string | null {
    return main.store.sketches[this.id].entrypoint
  }

  /** Get the sketch's path. */
  get path(): string {
    return main.store.sketches[this.id].path
  }

  /** Get the sketch's open tabs. */
  get tabs(): Tab[] {
    return Object.values(main.store.tabs)
      .filter((t) => t.sketchId == this.id)
      .map((t) => main.tabs[t.id])
  }

  /** Update the sketch's immutable state with an Immer `recipe` function. */
  change(recipe: (draft: Draft<SketchConfig>) => void): void {
    return main.change((s) => {
      recipe(s.sketches[this.id])
    })
  }

  /**
   * Actions.
   */

  /** Serve the sketch's entrypoint with esbuild from memory. */
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
        t.entrypoint = `http://localhost:${serve.port}/${file}`
      })
    })
  }

  /** Shutdown the sketch's server. */
  close() {
    if (this.#build && this.#build.stop != null) this.#build.stop()
    if (this.#serve) this.#serve.stop()
    this.#build = null
    this.#serve = null
  }
}
