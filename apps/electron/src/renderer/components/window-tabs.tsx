import { useStore } from '../contexts/store'
import {
  EntrypointState,
  TabState,
  WindowState,
} from '../../shared/store-state'
import { MdAdd, MdClose } from 'react-icons/md'

export let WindowTabs = (props: { window: WindowState }) => {
  let { window } = props
  let [store] = useStore()
  let tabs = window.tabIds.map((tid) => store.tabs[tid])
  return (
    <div className="flex h-10 pl-20 border-b border-gray-800 items-stretch">
      <div className="flex overflow-auto items-stretch px-px -space-x-px app-no-drag">
        {Object.values(tabs).map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            entrypoint={store.entrypoints[tab.entrypointId]}
            active={tab.id === window.activeTabId}
          />
        ))}
      </div>
      <div className="flex items-center pl-1 pr-1 app-no-drag">
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
  tab: TabState
  entrypoint: EntrypointState
  active: boolean
}) => {
  let { tab, active, entrypoint } = props
  let { id } = tab
  let { path } = entrypoint
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
      <span className="pb-px select-none inline-block max-w-[96px] text-ellipsis overflow-hidden whitespace-nowrap">
        {file}
      </span>{' '}
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
