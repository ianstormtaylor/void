import { Settings } from './settings'
import { State } from './sketch'

/** A package that represents a sketch with settings. */
export interface Module<T extends Record<string, any> = Record<string, any>> {
  settings: Settings<T>
  sketch: Sketch<T>
}

/** The sketch factory which sets up and returns a draw function. */
export type Sketch<T extends Record<string, any> = Record<string, any>> = (
  state: State<T> & {
    context: CanvasRenderingContext2D
  }
) => void
