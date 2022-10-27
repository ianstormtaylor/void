import Path from 'path'

// Operating system
export let IS_MAC = process.platform === 'darwin'
export let IS_WINDOWS = process.platform === 'win32'
export let IS_LINUX = process.platform === 'linux'

// Development vs. production
export let IS_PROD = process.env.NODE_ENV === 'production'
export let IS_DEV = !IS_PROD

// The URL to the server entrypoint.
export let RENDERER_URL = IS_DEV
  ? process.env.ELECTRON_RENDERER_URL
  : `file://${Path.resolve(__dirname, '../renderer/index.html')}`
