import { Sketch } from '..'

declare global {
  var VOID:
    | undefined
    | {
        sketch?: Sketch
      }
}
