import { useConfig } from '@/contexts/config'
import { MdClose, MdCropSquare, MdReplay } from 'react-icons/md'
import { IconButton } from './icon-button'

export let Banner = () => {
  let [config] = useConfig()
  let { tabs } = config
  return (
    <div className="flex h-10 pl-20 bg-gray-900 items-stretch">
      {Object.values(tabs).map((tab) => (
        <Tab key={tab.id} id={tab.id} path={tab.path} />
      ))}
    </div>
  )
}

export let Tab = (props: { id: string; path: string }) => {
  let { id, path } = props
  let index = path.lastIndexOf('/')
  let file = path.slice(index + 1)
  console.log({ file })
  return (
    <div className="flex items-center space-x-2 bg-gray-800 border-x border-gray-700 pl-4 pr-1 text-white text-xs">
      <span className="font-mono pb-px">{file}</span>{' '}
      <button
        title="Close Tab"
        className={`
          text-sm flex w-6 h-6 items-center justify-center rounded
          text-gray-500 hover:bg-gray-700 hover:text-gray-300
        `}
      >
        <MdClose />
      </button>
    </div>
  )
}
