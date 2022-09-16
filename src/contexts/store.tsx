import React, { createContext, useContext } from 'react'
import { Settings } from '../engine/sketch'
import { produce } from 'immer'
import useLocalStorage from 'use-local-storage'

export type Store = Settings & {
  hiddens: string[]
  seeds: number[]
  variables: Record<string, any>
  zoom?: number
}

export let useLoadStore = (key: string) => {
  return useLocalStorage<Store>(key, {
    hiddens: [],
    seeds: [],
    variables: {},
  })
}

export let StoreContext = createContext<Store | null>(null)

export let SetStoreContext = createContext<React.Dispatch<
  React.SetStateAction<Store>
> | null>(null)

export let useStore = () => {
  let store = useContext(StoreContext)
  if (!store) throw new Error(`You must use <StoreProvider> in the tree!`)
  return store
}

export let useSetStore = () => {
  let setStore = useContext(SetStoreContext)
  if (!setStore) throw new Error(`You must use <SetStoreProvider> in the tree!`)
  return setStore
}

export let useUpdateStore = () => {
  let setStore = useSetStore()
  let updateStore = (fn: (store: Store) => void) => setStore(produce(fn))
  return updateStore
}
