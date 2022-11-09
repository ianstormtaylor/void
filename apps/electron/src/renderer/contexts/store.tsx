import { enablePatches } from 'immer'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StoreState } from '../../shared/store-state'
import { createRendererStore } from '../../shared/store/renderer'

// Enable patches in this process's immer package.
enablePatches()

// Create a renderer store that proxies to the preload store.
let store = createRendererStore(electron.store)

/** Use the synchronized store's state as a hook. */
export let useStore = (): readonly [
  StoreState,
  (recipe: (draft: StoreState) => StoreState | void) => void
] => {
  let [count, setCount] = useState(0)
  let value = useMemo(() => store.get(), [count])
  let setValue = useCallback(
    (recipe: (draft: StoreState) => StoreState | void) => {
      store.change(recipe)
    },
    []
  )

  useEffect(() => {
    return store.subscribe(() => setCount(count++))
  }, [])

  return [value, setValue]
}
