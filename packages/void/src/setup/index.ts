import { Scene } from '../interfaces/scene'
import { Settings } from '../interfaces/settings'
import { setup as internalSetup } from '../internal'

export type CanvasScene = Scene & {
  context: CanvasRenderingContext2D
}

/** Setup the canvas and current scene for a sketch. */
export function setup(options: Settings): CanvasScene {
  let { el = document.body, canvas, context } = Void

  if (!canvas) {
    canvas = (el.querySelector('canvas#void-canvas') ??
      document.createElement('canvas')) as HTMLCanvasElement
  }

  if (!context) {
    context = canvas.getContext('2d')!
  }

  if (!context) {
    throw new Error(`Unable to get 2D rendering context from Canvas!`)
  }

  let scene = internalSetup(options)
  let [outerWidth, outerHeight] = Scene.outerDimensions(scene)
  let [screenWidth, screenHeight] = Scene.screenDimensions(scene)
  let [outputWidth, outputHeight] = Scene.outputDimensions(scene)

  canvas.id = 'void-canvas'
  canvas.width = screenWidth
  canvas.height = screenHeight
  canvas.style.width = `${outputWidth}px`
  canvas.style.height = `${outputHeight}px`
  el.appendChild(canvas)

  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, screenWidth, screenHeight)
  context.scale(screenWidth / outerWidth, screenHeight / outerHeight)
  context.translate(scene.margin[1], scene.margin[0])

  return { ...scene, context }
}
