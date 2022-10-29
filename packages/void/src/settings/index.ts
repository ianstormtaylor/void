import { Orientation, Units } from '..'
export * as Settings from './methods'

/** The core settings needed to run a sketch. */
export type Settings = {
  dpi: number
  fps: number
  frames: number
  height: number
  margin: [number, number, number, number]
  orientation: Orientation
  precision: number
  seed: number
  units: Units
  width: number
}
