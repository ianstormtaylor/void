import { useConfig } from '../contexts/config'
import {
  SketchConfig,
  TabConfig,
  WindowConfig,
} from '../../electron/shared/config'
import { MdAdd, MdClose } from 'react-icons/md'

export let Banner = (props: { window: WindowConfig }) => {
  let { window } = props
  let [config] = useConfig()
  let tabs = window.tabIds.map((tid) => config.tabs[tid])
  return (
    <div className="flex h-10 pl-20 bg-gray-900 border-b border-gray-800 items-stretch app-drag">
      <div className="flex items-stretch px-px -space-x-px app-no-drag">
        {Object.values(tabs).map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            sketch={config.sketches[tab.sketchId]}
            active={tab.id === window.activeTabId}
          />
        ))}
      </div>
      <div className="flex items-center ml-1 app-no-drag">
        <button
          className={`
            flex w-7 h-7 items-center justify-center rounded-full cursor-default
            text-gray-300 hover:bg-gray-800 hover:text-white
          `}
          onClick={() => {
            electron.open()
          }}
        >
          <MdAdd />
        </button>
      </div>
    </div>
  )
}

export let Tab = (props: {
  tab: TabConfig
  sketch: SketchConfig
  active: boolean
}) => {
  let { tab, active, sketch } = props
  let { id } = tab
  let { path } = sketch
  let index = path.lastIndexOf('/')
  let file = path.slice(index + 1)
  return (
    <div
      className={`
        group flex items-center space-x-1.5 pl-4 pr-3 text-xs border-gray-800 border-x 
        ${
          active
            ? 'text-white bg-gray-800'
            : 'text-gray-400 bg-gray-900 hover:text-white'
        }
      `}
      onClick={() => {
        if (!active) electron.activateTab(id)
      }}
    >
      <span className="pb-px select-none">{file}</span>{' '}
      <button
        title="Close Tab"
        className={`
           text-sm flex w-4 h-4 mt-px items-center justify-center rounded cursor-default
          ${
            active
              ? 'text-gray-500 hover:text-white'
              : 'text-gray-500 hover:text-white opacity-0 group-hover:opacity-100'
          } 
        `}
        onClick={(e) => {
          e.stopPropagation()
          electron.closeTab(id)
        }}
      >
        <MdClose />
      </button>
    </div>
  )
}
