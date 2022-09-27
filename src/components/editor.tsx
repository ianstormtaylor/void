import { useMemo, useRef } from 'react'
import { State } from '../../electron/shared/engine/sketch'
import { Sidebar } from './sidebar'
import { useMeasure } from 'react-use'
import { Canvas, CanvasRefContext } from './canvas'
import { SketchStore } from '../contexts/sketch-store'
import {
  MdAutoAwesome,
  MdBuild,
  MdFavoriteBorder,
  MdGridView,
  MdZoomIn,
} from 'react-icons/md'
import { SketchConfig, TabConfig } from 'electron/shared/config'
import { useConfig } from '@/contexts/config'
import { Module } from 'electron/shared/engine/module'
import { Settings } from 'electron/shared/engine/settings'

export let Editor = (props: {
  tab: TabConfig
  module: Module
  store: SketchStore
  sketch: SketchConfig
}) => {
  let { sketch, tab, module } = props
  let canvasRef = useRef<HTMLCanvasElement>()
  let [parentRef, { width: parentWidth, height: parentHeight }] = useMeasure()
  let state = useMemo(() => {
    if (!parentHeight || !parentWidth) return
    let { settings } = module
    let s: Settings = Object.assign(
      { dimensions: [parentWidth, parentHeight, 'px'] },
      settings,
      tab.settings,
      { traits: {} }
    )

    for (let [key, value] of Object.entries(settings.traits ?? {})) {
      s.traits![key] =
        tab.settings.traits != null && key in tab.settings.traits
          ? tab.settings.traits[key]
          : value
    }

    console.log('initializing…', s)
    return new State(s)
  }, [module, tab, parentWidth, parentHeight])

  return (
    <CanvasRefContext.Provider value={canvasRef}>
      <div className="relative flex flex-col items-stretch w-screen h-screen bg-gray-100">
        <EditorToolbar tab={tab} />
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
                zoom={tab.zoom}
              />
            )}
          </div>
          <div className="absolute inset-y-0 right-0 w-64 border-l border-gray-200 bg-white">
            {state && <Sidebar tab={tab} state={state} />}
          </div>
        </div>
      </div>
    </CanvasRefContext.Provider>
  )
}

export let EditorToolbar = (props: { tab: TabConfig }) => {
  let [config, setConfig] = useConfig()
  let { tab } = props
  return (
    <div className="relative z-10 flex items-center justify-between h-12 p-2 bg-gray-800">
      <div className="flex items-center space-x-1">
        <button
          title="Close Tab"
          className={`
              flex w-8 h-8 items-center justify-center rounded cursor-default
              hover:text-white hover:bg-gray-700
              ${tab.inspecting ? 'text-gray-100' : 'text-gray-400'} 
            `}
          onClick={(e) => {
            e.stopPropagation()
            electron.inspectTab(tab.id)
          }}
        >
          <MdBuild className="text-lg" />
        </button>
        <button
          title="Zoom Level"
          className={`
              flex h-8 px-2 items-center justify-center space-x-1 rounded cursor-default
              hover:text-white hover:bg-gray-700
              ${tab.inspecting ? 'text-gray-100' : 'text-gray-400'} 
            `}
          onClick={(e) => {
            e.stopPropagation()
            electron.inspectTab(tab.id)
          }}
        >
          <MdZoomIn className="text-xl" />{' '}
          <span className="text-sm">
            {tab.zoom ? `${Math.round(tab.zoom) * 100}%` : 'Fit'}
          </span>
        </button>
      </div>
      <div className="flex items-center space-x-1">
        <button
          title="Close Tab"
          className={`
              flex w-8 h-8 items-center justify-center rounded cursor-default
              hover:text-white hover:bg-gray-700
              ${tab.inspecting ? 'text-gray-100' : 'text-gray-400'} 
            `}
          onClick={(e) => {
            e.stopPropagation()
            electron.inspectTab(tab.id)
          }}
        >
          <MdAutoAwesome className="text-lg" />
        </button>
        <button
          title="Close Tab"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            hover:text-white hover:bg-gray-700
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-400'} 
          `}
          onClick={(e) => {
            e.stopPropagation()
            electron.inspectTab(tab.id)
          }}
        >
          <MdFavoriteBorder className="text-lg" />
        </button>
        <button
          title="Close Tab"
          className={`
              flex w-8 h-8 items-center justify-center rounded cursor-default
              hover:text-white hover:bg-gray-700
              ${tab.inspecting ? 'text-gray-100' : 'text-gray-400'} 
            `}
          onClick={(e) => {
            e.stopPropagation()
            electron.inspectTab(tab.id)
          }}
        >
          <MdGridView className="text-lg" />
        </button>
      </div>
    </div>
  )
}
