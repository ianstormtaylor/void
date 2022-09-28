import { createContext, useContext } from 'react'
import { ResolvedSettings } from '../../void'

/** A context for the current sketch settings. */
export let SettingsContext = createContext<ResolvedSettings | null>(null)

/** Use the current sketch settings. */
export let useSettings = (): ResolvedSettings => {
  let settings = useContext(SettingsContext)
  if (!settings) throw new Error('You must render <SettingsContext.Provider>')
  return settings
}
