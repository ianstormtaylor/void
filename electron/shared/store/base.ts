import produce, { Patch, enablePatches, applyPatches } from 'immer'

enablePatches()

/** The IPC channel used when new renderer processes connect. */
export let CONNECT_CHANNEL = '__SHARED_STATE_CONNECT__'

/** The IPC channel used when new changes are applied to the store. */
export let CHANGE_CHANNEL = '__SHARED_STATE_CHANGE__'

/** A listener function that gets called when the store's state changes. */
export type Listener<T extends Record<string, any>> = (
  state: T,
  prevState: T,
  patches: Patch[]
) => void

/** A store that is synced across Electron processes. */
export type Store<T extends Record<string, any>> = {
  /** Get the store's current state. */
  get: () => T
  /** Change the store's immutable state using an Immer `recipe` function. */
  change: (recipe: (draft: T) => T | void) => void
  /** Apply a set of patches to the store's immutable state. */
  patch: (patches: Patch[]) => void
  /** Subscribe to the store's state when changes are applied. */
  subscribe: (listener: Listener<T>) => () => void
}

/** Create a store with an `initialState` and process-specific `send` logic. */
export function createStore<T extends Record<string, any>>(
  initialState: T,
  send: (patches: Patch[], senderId?: number) => void
) {
  let state = initialState
  let listeners: Listener<T>[] = []
  let isUpdating = false
  let emit = (prevState: T, patches: Patch[]) => {
    for (let listener of listeners) {
      listener(state, prevState, patches)
    }
  }

  let store: Store<T> = {
    get() {
      return state
    },

    change(recipe) {
      let patches: Patch[] = []
      let prevState = state
      isUpdating = true
      state = produce(state, recipe, (p) => (patches = p))
      isUpdating = false
      send(patches)
      emit(prevState, patches)
    },

    patch(patches) {
      if (patches.length === 0) return
      let prevState = state
      state = applyPatches(state, patches)
      send(patches)
      emit(prevState, patches)
    },

    subscribe(listener) {
      if (isUpdating) throw new Error('Cannot subscribe() while changing!')
      listeners.push(listener)
      listener(state, state, [])

      return () => {
        if (isUpdating) throw new Error('Cannot unsubscribe() while changing!')
        let index = listeners.indexOf(listener)
        listeners.splice(index, 1)
      }
    },
  }

  return store
}
