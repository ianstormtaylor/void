import { EntrypointState } from '../../shared/store-state'
import { createContext, useCallback, useContext } from 'react'
import { useStore } from './store'
import { Changer, Producer } from '../utils'

/** A context for the sketch's entrypoint. */
export let EntrypointContext = createContext<EntrypointState | null>(null)

/** Use the sketch's entrypoint. */
export let useEntrypoint = (): [EntrypointState, Changer<EntrypointState>] => {
  let entrypoint = useContext(EntrypointContext)
  let [, changeStore] = useStore()
  let changeEntrypoint = useCallback(
    (recipe: Producer<EntrypointState>) => {
      changeStore((c) => {
        if (!entrypoint) return
        recipe(c.entrypoints[entrypoint.id])
      })
    },
    [entrypoint, changeStore]
  )

  if (!entrypoint) {
    throw new Error('You must render <EntrypointContext.Provider>')
  }

  return [entrypoint, changeEntrypoint]
}
