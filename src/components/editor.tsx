import React, { useMemo, useRef } from 'react'
import { Module, Settings, State } from '../engine/sketch'
import { Sidebar } from './sidebar'
import { useMeasure } from 'react-use'
import { Canvas, CanvasRefContext } from './canvas'
import { SketchStore } from '../contexts/sketch-store'
import { MdBuild, MdClose, MdHandyman, MdOutlineBuild } from 'react-icons/md'
import { SketchConfig, TabConfig } from 'electron/shared/config'

export let Editor = (props: {
  tab: TabConfig
  module: Module
  store: SketchStore
  sketch: SketchConfig
}) => {
  let { sketch, tab, module, store } = props
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
      <div className="relative flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <div className="relative z-10 flex items-center h-12 bg-gray-800">
          <button
            title="Close Tab"
            className={`
              text-lg flex w-12 h-12 items-center justify-center rounded cursor-default
              ${
                tab.inspecting
                  ? 'text-gray-100 hover:text-white'
                  : 'text-gray-400 hover:text-white'
              } 
            `}
            onClick={(e) => {
              e.stopPropagation()
              electron.inspectTab(tab.id)
            }}
          >
            <MdBuild />
          </button>
        </div>
        <div className="relative flex-1">
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
      </div>
    </CanvasRefContext.Provider>
  )
}
