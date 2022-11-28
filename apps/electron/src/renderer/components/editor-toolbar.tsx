import { MdBuild, MdFavoriteBorder, MdGridView } from 'react-icons/md'
import { useTab } from '../contexts/tab'
import { useEntrypoint } from '../contexts/entrypoint'

export let EditorToolbar = () => {
  let [tab, changeTab] = useTab()
  let [entrypoint] = useEntrypoint()
  let path = `.../${entrypoint.path.split('/').slice(-3).join('/')}`
  return (
    <div className="relative z-10 flex items-center justify-between h-12 p-2 bg-gray-800">
      <div className="flex items-center space-x-1">
        <button
          title="Close Tab"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-300
            focus-visible:outline-none
            hover:text-white hover:bg-gray-700
          `}
          onClick={() => {
            electron.inspectTab(tab.id)
          }}
        >
          <MdBuild className="text-lg" />
        </button>
      </div>
      <div className="text-sm text-gray-500">{path}</div>
      <div className="flex items-center space-x-1">
        <select
          title="Zoom Level"
          value={tab.zoom ?? 1}
          className={`
            flex h-8 px-2 items-center justify-center space-x-1 rounded cursor-default
            text-sm tracking-light
            text-gray-300 bg-transparent
            focus-visible:outline-none
            hover:text-white hover:bg-gray-700
          `}
          onChange={(e) => {
            changeTab((t) => {
              t.zoom = Number(e.target.value)
            })
          }}
        >
          <option value={4}>400%</option>
          <option value={2}>200%</option>
          <option value={1}>100%</option>
          <option value={0.5}>50%</option>
          <option value={0.25}>25%</option>
          <option value={0.125}>13%</option>
        </select>
        {/* <button
          title="Favorite Variant"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-300
            hover:text-white hover:bg-gray-700
          `}
        >
          <MdFavoriteBorder className="text-lg" />
        </button>
        <button
          title="Show Variants"
          className={`
            flex w-8 h-8 items-center justify-center rounded cursor-default
            text-gray-300
            hover:text-white hover:bg-gray-700
          `}
        >
          <MdGridView className="text-lg" />
        </button> */}
      </div>
    </div>
  )
}
