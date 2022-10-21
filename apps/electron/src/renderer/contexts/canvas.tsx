import { createContext, useContext } from 'react'

/** A context that keeps a reference to the current <canvas> element. */
export let CanvasRefContext =
  createContext<React.RefObject<HTMLCanvasElement | null> | null>(null)

/** Use a reference to the current <canvas> element. */
export let useCanvasRef = (): React.RefObject<HTMLCanvasElement | null> => {
  let canvasRef = useContext(CanvasRefContext)
  if (!canvasRef) throw new Error('You must render <CanvasContext.Provider>')
  return canvasRef
}
