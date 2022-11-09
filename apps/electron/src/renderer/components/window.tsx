import { MdAdd, MdOpenInBrowser } from 'react-icons/md'
import { useWindow } from '../contexts/window'
import { WindowTabs } from './window-tabs'

export let Window = () => {
  let [window] = useWindow()
  let hasTabs = window.tabIds.length > 0
  return (
    <div className="w-full h-full bg-gray-900 app-drag">
      <WindowTabs key={window.id} window={window} />
      {hasTabs ? null : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center app-no-drag">
            <button
              className={`
              flex items-center space-x-1 bg-gray-100 rounded py-3 px-5 text-gray-900
              hover:bg-white hover:text-black
            `}
              onClick={() => electron.open()}
            >
              <span>Open Sketch…</span>
            </button>
            <p className="mt-4 text-sm text-gray-500">
              Or drag a sketch file here.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
