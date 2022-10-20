import { TabConfig } from '../../shared/config'
import { createContext, useCallback, useContext } from 'react'
import { useConfig } from './config'
import { Changer, Producer } from '../utils'

/** A context for the sketch's JavaScript Tab. */
export let TabContext = createContext<TabConfig | null>(null)

/** Use the sketch's JavaScript Tab. */
export let useTab = (): [TabConfig, Changer<TabConfig>] => {
  let [, setConfig] = useConfig()
  let tab = useContext(TabContext)
  let changeTab = useCallback(
    (recipe: Producer<TabConfig>) => {
      setConfig((c) => {
        if (!tab) return
        let t = c.tabs[tab.id]
        recipe(t)
      })
    },
    [tab, setConfig]
  )

  if (!tab) {
    throw new Error('You must render <TabContext.Provider>')
  }

  return [tab, changeTab]
}
