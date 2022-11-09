import { WindowState } from '../../shared/store-state'
import { createContext, useCallback, useContext } from 'react'
import { useStore } from './store'
import { Changer, Producer } from '../utils'

/** A context for the app's window. */
export let WindowContext = createContext<WindowState | null>(null)

/** Use the app's window. */
export let useWindow = (): [WindowState, Changer<WindowState>] => {
  let win = useContext(WindowContext)
  let [, changeStore] = useStore()
  let changeWindow = useCallback(
    (recipe: Producer<WindowState>) => {
      changeStore((c) => {
        if (!win) return
        recipe(c.windows[win.id])
      })
    },
    [win, changeStore]
  )

  if (!win) {
    throw new Error('You must render <WindowContext.Provider>')
  }

  return [win, changeWindow]
}
