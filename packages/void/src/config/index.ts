import { Dimensions } from '../interfaces/dimensions'
import { Orientation } from '../interfaces/orientation'
import { Paper } from '../interfaces/paper'
import { Units } from '../interfaces/units'

export * as Config from './methods'

/** The configuration options for a sketch, with shorthands allowed. */
export type Config = {
  dimensions?: Dimensions<2> | Paper
  dpi?: number
  fps?: number
  frames?: number
  margin?: Dimensions<1> | Dimensions<2> | Dimensions<3> | Dimensions<4>
  orientation?: Orientation
  precision?: Dimensions<1>
  seed?: number
  units?: Units
}
