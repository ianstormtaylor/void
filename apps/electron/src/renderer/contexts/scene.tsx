import { createContext, useContext } from 'react'
import { Scene } from 'void'

/** A context for the Scene's `Scene` object. */
export let SceneContext = createContext<Scene | null>(null)

/** Use the current `Scene` object. */
export let useScene = (): Scene => {
  let scene = useContext(SceneContext)
  if (!scene) throw new Error('You must render <SceneContext.Provider>')
  return scene
}
