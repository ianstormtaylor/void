import { useEffect, useMemo, useState } from 'react'
import { Config } from '../../electron/shared/config'

/** Use the shared Electron store as a React hook. */
let useSharedStore = (): readonly [
  Config,
  (recipe: (draft: Config) => void) => void
] => {
  let { store } = electron
  let [count, setCount] = useState(0)
  // let store = useMemo(() => createSharedStore(initialState), [initialState])

  // Create the return value memoized by the counter to react to changes.
  let ret = useMemo(() => {
    return [store.getState(), store.setState] as const
  }, [store, count])

  // Listen to changes in the store and increment a counter.
  useEffect(() => {
    let unsubscribe = store.subscribe(() => setCount(count++))
    return () => unsubscribe()
  }, [store])

  return ret as any
}

/** Use the synchronized config store. */
export let useConfig = () => {
  return useSharedStore()
}

/** Use a tab by `id`. */
export let useTab = (id: number | string) => {
  let [config] = useConfig()
  let tab = config.tabs[id]
  if (!tab) throw new Error(`Could not find tab by ID: "${id}"`)
  return tab
}
