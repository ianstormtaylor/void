import { Module } from '../../void'
import { createContext, useContext } from 'react'

/** A context for the sketch's JavaScript module. */
export let ModuleContext = createContext<Module | null>(null)

/** Use the sketch's JavaScript module. */
export let useModule = (): Module => {
  let module = useContext(ModuleContext)
  if (!module) throw new Error('You must render <ModuleContext.Provider>')
  return module
}
