import { Scene } from '..'
// @ts-ignore
import { snippet } from './snippet'

/** A weak map for storing a reference to the scene's seeded random. */
let FX = new WeakMap<Scene, Fx>()

type Fx = {
  fxhash: string
  fxrand: () => number
  fxpreview: () => void
  isFxpreview: boolean
}

/** Get the fx(hash) global variables for the sketch. */
export function fx(): Fx {
  if (process.env.NODE_ENV === 'production') {
    return window as any
  } else {
    let { scene } = Void
    if (!scene)
      throw new Error(`Cannot call fx() before calling setup() in a sketch!`)
    if (!FX.has(scene)) FX.set(scene, (snippet as () => Fx)())
    let fx = FX.get(scene)!
    return fx
  }
}
