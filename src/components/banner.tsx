import { useConfig } from '@/contexts/config'
import { TabConfig, WindowConfig } from 'electron/shared/config'
import { MdClose } from 'react-icons/md'

export let Banner = (props: { window: WindowConfig }) => {
  let { window: win } = props
  let [config] = useConfig()
  let { tabs } = config
  return (
    <div className="flex h-10 pl-20 bg-gray-900 items-stretch">
      <div className="flex items-stretch bg-gray-700 px-px space-x-px">
        {Object.values(tabs).map((tab) => (
          <Tab key={tab.id} tab={tab} active={tab.id === win.activeTabId} />
        ))}
      </div>
    </div>
  )
}

export let Tab = (props: { tab: TabConfig; active: boolean }) => {
  let { tab, active } = props
  let { id, path } = tab
  let index = path.lastIndexOf('/')
  let file = path.slice(index + 1)
  return (
    <div
      className={`
        flex items-center space-x-2 pl-4 pr-2 text-xs cursor-pointer font-light
        ${
          active
            ? 'text-white bg-gray-800'
            : 'text-gray-400 bg-gray-900 hover:bg-gray-800 hover:text-gray-200'
        }
      `}
      onClick={() => {
        if (!active) electron.activateTab(id)
      }}
    >
      <span className="font-mono pb-px">{file}</span>{' '}
      <button
        title="Close Tab"
        className={`
          text-sm flex w-5 h-5 items-center justify-center rounded
          text-gray-500 hover:bg-gray-700 hover:text-gray-300
        `}
      >
        <MdClose />
      </button>
    </div>
  )
}
