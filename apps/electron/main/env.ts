import Path from 'path'

// Environment variables.
export let NODE_ENV = process.env['NODE_ENV']
export let VITE_DEV_SERVER_HOST = process.env['VITE_DEV_SERVER_HOST']
export let VITE_DEV_SERVER_PORT = process.env['VITE_DEV_SERVER_PORT']
export let REACT_DEVTOOLS_EXTENSION = process.env['REACT_DEVTOOLS_EXTENSION']

// Environment checks.
export let IS_RENDERER = process.type === 'renderer'
export let IS_MAIN = process.type === 'browser'
export let IS_MAC = process.platform === 'darwin'
export let IS_WINDOWS = process.platform === 'win32'
export let IS_DEV = NODE_ENV !== 'production'
export let IS_PROD = NODE_ENV === 'production'

// The URL to the server entrypoint.
export let SERVER_URL = IS_DEV
  ? `http://${VITE_DEV_SERVER_HOST}:${VITE_DEV_SERVER_PORT}`
  : `file://${Path.resolve(__dirname, '../index.html')}`
