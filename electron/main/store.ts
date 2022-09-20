import { createSharedStore } from '../shared/shared-state'
import { config } from '../shared/config'

/** The shared store for the main process. */
export let store = createSharedStore(config.store)
