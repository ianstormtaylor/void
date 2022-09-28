import {
  MdAutoAwesome,
  MdBuild,
  MdFavoriteBorder,
  MdGridView,
} from 'react-icons/md'
import { useTab } from '../contexts/tab'
import { useSketch } from '../contexts/sketch'

export let EditorToolbar = () => {
  let tab = useTab()
  let sketch = useSketch()
  let path = `.../${sketch.path.split('/').slice(-3).join('/')}`
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
            electron.inspectTab(tab.id)
          }}
        >
          <span className="text-sm font-semibold tracking-tight">
            {tab.zoom ? `${Math.round(tab.zoom) * 100}%` : '100%'}
          </span>
        </button>
      </div>
      <div className="text-sm text-gray-500">{path}</div>
      <div className="flex items-center space-x-1">
        <button
          title="Close Tab"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-400 hover:text-white hover:bg-gray-700
          `}
          onClick={(e) => {}}
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
          onClick={(e) => {}}
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
          onClick={(e) => {}}
        >
          <MdGridView className="text-lg" />
        </button>
      </div>
    </div>
  )
}
