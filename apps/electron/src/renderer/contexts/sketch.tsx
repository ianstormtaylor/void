import { SketchState } from '../../shared/store-state'
import { createContext, useContext } from 'react'

/** A context for the sketch's JavaScript Sketch. */
export let SketchContext = createContext<SketchState | null>(null)

/** Use the sketch's JavaScript Sketch. */
export let useSketch = (): SketchState => {
  let sketch = useContext(SketchContext)
  if (!sketch) throw new Error('You must render <SketchContext.Provider>')
  return sketch
}
