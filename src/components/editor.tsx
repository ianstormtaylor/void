import React, { useMemo, useRef } from 'react'
import { Module, Settings, State } from '../engine/sketch'
import { Sidebar } from './sidebar'
import { useMeasure } from 'react-use'
import { Canvas, CanvasRefContext } from './canvas'
import { Store } from '../contexts/store'

export let Editor = (props: { module: Module; store: Store }) => {
  let { module, store } = props
  let canvasRef = useRef<HTMLCanvasElement>()
  let [parentRef, { width: parentWidth, height: parentHeight }] = useMeasure()
  let state = useMemo(() => {
    if (!parentHeight || !parentWidth) return
    let { settings } = module
    let s: Settings = Object.assign(
      { dimensions: [parentWidth, parentHeight, 'px'] },
      settings,
      store,
      { variables: {} }
    )

    for (let [key, value] of Object.entries(settings.variables)) {
      s.variables[key] = key in store.variables ? store.variables[key] : value
    }

    console.log('initializing…', s)
    return new State(s)
  }, [module, store, parentWidth, parentHeight])

  return (
    <CanvasRefContext.Provider value={canvasRef}>
      <div className="relative w-screen h-screen bg-gray-100">
        <div
          ref={parentRef}
          className="absolute inset-0 right-64 flex justify-center items-center"
        >
          {state && parentWidth && parentHeight && (
            <Canvas
              ref={canvasRef}
              maxWidth={parentWidth - 40 * 2}
              maxHeight={parentHeight - 40 * 2}
              state={state}
              sketch={module.sketch}
              zoom={store.zoom}
            />
          )}
        </div>
        <div className="absolute inset-y-0 right-0 w-64 border-l border-gray-200 bg-white">
          {state && <Sidebar store={store} state={state} />}
        </div>
      </div>
    </CanvasRefContext.Provider>
  )
}
