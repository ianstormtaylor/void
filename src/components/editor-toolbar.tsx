import {
  MdBuild,
  MdClear,
  MdFavoriteBorder,
  MdGridView,
  MdOutlineAutoAwesome,
} from 'react-icons/md'
import { useTab } from '../contexts/tab'
import { useSketch } from '../contexts/sketch'
import { Schema } from '../../void'

export let EditorToolbar = (props: { schema: Schema | null }) => {
  let { schema } = props
  let [tab, changeTab] = useTab()
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
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
          onClick={() => {
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
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
          onClick={() => {
            electron.inspectTab(tab.id)
          }}
        >
          <span className="text-sm tracking-tight">
            {tab.zoom ? `${Math.round(tab.zoom) * 100}%` : '100%'}
          </span>
        </button>
      </div>
      <div className="text-sm text-gray-400">{path}</div>
      <div className="flex items-center space-x-1">
        <button
          title="Favorite Variant"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            hover:text-white hover:bg-gray-700
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
        >
          <MdFavoriteBorder className="text-lg" />
        </button>
        <button
          title="Show Variants"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            hover:text-white hover:bg-gray-700
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
        >
          <MdGridView className="text-lg" />
        </button>
      </div>
    </div>
  )
}
