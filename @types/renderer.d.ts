import { Electron } from '../electron/preload'

declare global {
  let electron: Electron
  interface Window {
    electron: Electron
  }
}
