import { Electron } from '../preload'
import { Void } from 'void'

declare global {
  var electron: Electron
  var Void: Void
}
