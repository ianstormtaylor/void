import { useEffect, useMemo, useState } from 'react'
import { createSharedStore } from '../../electron/shared/shared-state'
import { config } from '../../electron/shared/config'

/** Use the shared Electron store as a React hook. */
let useSharedStore = <T extends Record<string, any>>(
  initialState: T
): readonly [T, (recipe: (draft: T) => void) => void] => {
  let [count, setCount] = useState(0)
  let store = useMemo(() => createSharedStore(initialState), [initialState])

  // Create the return value memoized by the counter to react to changes.
  let ret = useMemo(() => {
    console.log('recomputing store…', store.getState())
    return [store.getState(), store.setState] as const
  }, [store, count])

  // Listen to changes in the store and increment a counter.
  useEffect(() => {
    console.log('subscribing to store…')
    let unsubscribe = store.subscribe(() => setCount(count++))
    return () => unsubscribe()
  }, [store])

  return ret
}

/** Use the synchronized config store. */
export let useConfig = () => {
  return useSharedStore(config.store)
}

/** Use a tab by `id`. */
export let useTab = (id: number | string) => {
  let [config] = useConfig()
  let tab = config.tabs[id]
  if (!tab) throw new Error(`Could not find tab by ID: "${id}"`)
  return tab
}
