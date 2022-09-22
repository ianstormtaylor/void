import { Electron } from '../electron/renderer/preload'

declare global {
  let electron: Electron
  interface Window {
    electron: Electron
  }
}
