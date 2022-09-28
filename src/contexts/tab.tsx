import { TabConfig } from '../../electron/shared/config'
import { createContext, useContext } from 'react'

/** A context for the sketch's JavaScript Tab. */
export let TabContext = createContext<TabConfig | null>(null)

/** Use the sketch's JavaScript Tab. */
export let useTab = (): TabConfig => {
  let tab = useContext(TabContext)
  if (!tab) throw new Error('You must render <TabContext.Provider>')
  return tab
}
