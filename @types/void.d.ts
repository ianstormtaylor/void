import { Void } from '../void/internal'

declare global {
  let Void: Void
  interface Window {
    Void: Void
  }
}
