// Load process in renderer-safe way.
let p = (typeof process !== 'undefined' && process) ?? ({} as NodeJS.Process)
let e = p?.env ?? {}

// Environment variables.
export let NODE_ENV = e['NODE_ENV']
export let VITE_DEV_SERVER_HOST = e['VITE_DEV_SERVER_HOST']
export let VITE_DEV_SERVER_PORT = e['VITE_DEV_SERVER_PORT']

// Constructed variables.
export let VITE_DEV_SERVER_URL = `http://${VITE_DEV_SERVER_HOST}:${VITE_DEV_SERVER_PORT}`

// Environment checks.
export let IS_RENDERER = p.type === 'renderer'
export let IS_MAIN = p.type === 'browser'
export let IS_MAC = p.platform === 'darwin'
export let IS_WINDOWS = p.platform === 'win32'
export let IS_DEV = NODE_ENV !== 'production'
export let IS_PROD = NODE_ENV === 'production'
