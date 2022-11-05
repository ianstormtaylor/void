import { EntrypointState } from '../../shared/store-state'
import { createContext, useContext } from 'react'

/** A context for the sketch's entrypoint. */
export let EntrypointContext = createContext<EntrypointState | null>(null)

/** Use the sketch's entrypoint. */
export let useEntrypoint = (): EntrypointState => {
  let entrypoint = useContext(EntrypointContext)
  if (!entrypoint)
    throw new Error('You must render <EntrypointContext.Provider>')
  return entrypoint
}
