import produce, { Patch, enablePatches } from 'immer'
import { useEffect, useMemo, useState } from 'react'
import { Config } from '../../shared/config'

enablePatches()

/** Use the synchronized config store. */
export let useConfig = (): readonly [
  Config,
  (recipe: (draft: Config) => Config | void) => void
] => {
  let { store } = electron
  let [count, setCount] = useState(0)

  // Create the return value memoized by the counter to react to changes.
  let ret = useMemo(() => {
    return [
      store.get(),
      (recipe: (draft: Config) => Config | void) => {
        let patches: Patch[] = []
        let state = store.get()
        produce(state, recipe, (p) => (patches = p))
        store.patch(patches)
      },
    ] as const
  }, [store, count])

  // Listen to changes in the store and increment a counter.
  useEffect(() => {
    return store.subscribe(() => {
      setCount(count++)
    })
  }, [store])

  return ret as any
}
