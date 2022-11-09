import { TabState } from '../../shared/store-state'
import { createContext, useCallback, useContext } from 'react'
import { useStore } from './store'
import { Changer, Producer } from '../utils'

/** A context for the sketch's tab. */
export let TabContext = createContext<TabState | null>(null)

/** Use the sketch's tab. */
export let useTab = (): [TabState, Changer<TabState>] => {
  let tab = useContext(TabContext)
  let [, changeStore] = useStore()
  let changeTab = useCallback(
    (recipe: Producer<TabState>) => {
      changeStore((c) => {
        if (!tab) return
        recipe(c.tabs[tab.id])
      })
    },
    [tab, changeStore]
  )

  if (!tab) {
    throw new Error('You must render <TabContext.Provider>')
  }

  return [tab, changeTab]
}
