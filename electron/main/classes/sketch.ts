import Path from 'path'
import crypto from 'node:crypto'
import { serve, ServeResult } from 'esbuild'
import { main } from './main'
import { Draft } from 'immer'
import { SketchConfig } from '../../shared/config'
import { Tab } from './tab'

/** A `Sketch` class holds a reference to a specific sketch file. */
export class Sketch {
  id: string
  #server: ServeResult | null

  /** Constructor a new `Sketch` instance by `id`. */
  constructor(id: string) {
    this.id = id
    this.#server = null
    this.serve()
  }

  /**
   * Statics.
   */

  /** Load a sketch by `path`, loading an existing one if possible. */
  static load(path: string): Sketch {
    let match = Object.values(main.sketches).find((s) => s.path === path)
    if (match) return match

    // If the sketch isn't already saved, add it to the main store.
    let json = Object.values(main.store.sketches).find((s) => s.path === path)
    let id = crypto.randomUUID()
    if (json) {
      id = json.id
    } else {
      main.change((m) => {
        m.sketches[id] = {
          id,
          path,
          entrypoint: null,
          traits: {},
        }
      })
    }

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
    if (this.#server) return
    let { path } = this
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

    this.#server = server
    setImmediate(() => {
      this.change((t) => {
        t.entrypoint = `http://localhost:${server.port}/${file}`
      })
    })
  }

  /** Shutdown the sketch's server. */
  close() {
    if (this.#server) {
      this.#server.stop()
      this.#server = null
    }
  }
}
