import { Draft } from 'immer'
import { Sketch, Units } from 'void'

/** A simplified `Producer` type for Immer. */
export type Producer<T> = (draft: Draft<T>) => void

/** An Immer change function. */
export type Changer<T> = (recipe: Producer<T>) => void
