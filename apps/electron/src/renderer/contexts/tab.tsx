import { TabState } from '../../shared/store-state'
import { createContext, useCallback, useContext } from 'react'
import { useStore } from './store'
import { Changer, Producer } from '../utils'

/** A context for the sketch's JavaScript Tab. */
export let TabContext = createContext<TabState | null>(null)

/** Use the sketch's JavaScript Tab. */
export let useTab = (): [TabState, Changer<TabState>] => {
  let [, setStore] = useStore()
  let tab = useContext(TabContext)
  let changeTab = useCallback(
    (recipe: Producer<TabState>) => {
      setStore((c) => {
        if (!tab) return
        let t = c.tabs[tab.id]
        recipe(t)
      })
    },
    [tab, setStore]
  )

  if (!tab) {
    throw new Error('You must render <TabContext.Provider>')
  }

  return [tab, changeTab]
}
