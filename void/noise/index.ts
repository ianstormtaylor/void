import SimplexNoise from 'simplex-noise'
import { Scene } from '..'

/** A weak map for storing a reference to the scene's seeded random. */
let NOISE = new WeakMap<Scene, SimplexNoise>()

/** Generate seeded simplex noise from `x`, `y`, `z`, and `w` coordinates. */
export function noise(x: number, y?: number, z?: number, w?: number): number {
  let { scene } = Void
  if (!scene) {
    throw new Error(`Cannot call noise() before calling setup()!`)
  }

  let n = NOISE.get(scene)
  if (n == null) {
    n = new SimplexNoise(scene.seed)
    NOISE.set(scene, n)
  }

  if (y == null) {
    return n.noise2D(x, 0)
  } else if (z == null) {
    return n.noise2D(x, y)
  } else if (w == null) {
    return n.noise3D(x, y, z)
  } else {
    return n.noise4D(x, y, z, w)
  }
}
