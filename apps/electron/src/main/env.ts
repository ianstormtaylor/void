import Path from 'path'
import { app } from 'electron'

// Operating system
export let IS_MAC = process.platform === 'darwin'
export let IS_WINDOWS = process.platform === 'win32'
export let IS_LINUX = process.platform === 'linux'

// Development vs. production
export let MODE = import.meta.env.MODE
export let IS_DEV = MODE === 'development'
export let IS_PROD = !IS_DEV

// The URL to the server entrypoint.
export let RENDERER_URL = app.isPackaged
  ? `file://${Path.resolve(__dirname, '../renderer/index.html')}`
  : process.env.ELECTRON_RENDERER_URL
