import { Units } from './units'

/** Dimensions of length `N`, with specific units. */
export type Dimensions<N extends number, T extends number[] = []> = T extends {
  length: N
}
  ? [...T, Units]
  : Dimensions<N, [...T, number]>

export type MarginDimensions =
  | Dimensions<1>
  | Dimensions<2>
  | Dimensions<3>
  | Dimensions<4>

export type CanvasDimensions = Dimensions<2>
