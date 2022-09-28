import { Traits, Scene, Settings } from '..'

/** A package that represents a sketch with settings. */
export interface Module<T extends Traits = Traits> {
  settings: Settings<T>
  sketch: Sketch<T>
}

/** The sketch factory which sets up and returns a draw function. */
export type Sketch<T extends Traits = Traits> = (
  state: Scene<T> & {
    context: CanvasRenderingContext2D
  }
) => void
