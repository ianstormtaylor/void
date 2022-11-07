import { Orientation, Size, Units, Sizes } from '..'

export * as Config from './methods'

/** The configuration options for a sketch, with shorthands allowed. */
export type Config = {
  dimensions?: Size | Sizes<2>
  dpi?: number
  fps?: number
  frames?: number
  hash?: string
  margin?: Sizes<1> | Sizes<2> | Sizes<3> | Sizes<4>
  orientation?: Orientation
  precision?: Sizes<1>
  seed?: number
  units?: Units
}
