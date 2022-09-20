import { createSharedStore } from 'electron-shared-state'
import { config } from '../../electron/shared/config'

/** The shared store for the renderer process. */
export let store = createSharedStore(config.store)
