import { Electron } from '../src/preload'
import { Void } from '../packages/void/src/internal'

declare global {
  var electron: Electron
  var Void: Void
}
