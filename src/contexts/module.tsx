import { createContext, useContext } from 'react'
import { Module } from '../../electron/shared/engine/sketch'

/** A context for the sketch's JavaScript module. */
export let ModuleContext = createContext<Module | null>(null)

/** Use the sketch's JavaScript module. */
export let useModule = (): Module => {
  let module = useContext(ModuleContext)
  if (!module) throw new Error('You must render <ModuleContext.Provider>')
  return module
}
