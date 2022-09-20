import React, { createContext, useContext } from 'react'
import { Settings } from '../engine/sketch'
import { produce } from 'immer'
import useLocalStorage from 'use-local-storage'

export type SketchStore = Settings & {
  hiddens: string[]
  seeds: number[]
  variables: Record<string, any>
  zoom?: number
}

export let useLoadSketchStore = (key: string) => {
  return useLocalStorage<SketchStore>(key, {
    hiddens: [],
    seeds: [],
    variables: {},
  })
}

export let SketchStoreContext = createContext<SketchStore | null>(null)

export let SetSketchStoreContext = createContext<React.Dispatch<
  React.SetStateAction<SketchStore>
> | null>(null)

export let useSketchStore = () => {
  let store = useContext(SketchStoreContext)
  if (!store) throw new Error(`You must use <SketchStoreProvider> in the tree!`)
  return store
}

export let useSetSketchStore = () => {
  let setStore = useContext(SetSketchStoreContext)
  if (!setStore)
    throw new Error(`You must use <SetSketchStoreProvider> in the tree!`)
  return setStore
}

export let useUpdateSketchStore = () => {
  let setStore = useSetSketchStore()
  let updateStore = (fn: (store: SketchStore) => void) => setStore(produce(fn))
  return updateStore
}
