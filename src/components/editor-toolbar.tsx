import {
  MdBuild,
  MdCancel,
  MdClear,
  MdFavoriteBorder,
  MdGridView,
  MdOutlineAutoAwesome,
  MdOutlineCancel,
  MdOutlineHighlight,
  MdOutlineHighlightOff,
} from 'react-icons/md'
import { useTab } from '../contexts/tab'
import { useSketch } from '../contexts/sketch'
import { useSettings } from '../contexts/settings'
import { Settings } from '../../void'

export let EditorToolbar = () => {
  let [tab, changeTab] = useTab()
  let settings = useSettings()
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
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
          onClick={(e) => {
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
          title="Reset Traits"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-300 hover:text-white hover:bg-gray-700
            ${
              tab.settings.traits != null &&
              Object.keys(tab.settings.traits).length > 0
                ? 'opacity-100'
                : 'opacity-0'
            }
          `}
          onClick={() => {
            changeTab((t) => {
              t.settings.traits = {}
            })
          }}
        >
          <MdClear className="text-lg" />
        </button>
        <button
          title="Auto-generate Traits"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-300 hover:text-white hover:bg-gray-700
          `}
          onClick={() => {
            changeTab((t) => {
              for (let key in settings.schema) {
                if (t.locks.includes(key)) continue
                let traits = (t.settings.traits = t.settings.traits ?? {})
                traits[key] = Settings.generate(settings, key)
              }
            })
          }}
        >
          <MdOutlineAutoAwesome className="text-lg" />
        </button>
        <button
          title="Favorite Variant"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            hover:text-white hover:bg-gray-700
            ${tab.inspecting ? 'text-gray-100' : 'text-gray-300'} 
          `}
          onClick={(e) => {}}
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
          onClick={(e) => {}}
        >
          <MdGridView className="text-lg" />
        </button>
      </div>
    </div>
  )
}
