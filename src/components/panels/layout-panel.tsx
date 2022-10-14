import { DimensionsField } from '../fields/dimensions-field'
import { MarginsField } from '../fields/margins-field'
import { MdCrop169, MdCropSquare } from 'react-icons/md'
import { useConfig } from '../../contexts/config'
import { useTab } from '../../contexts/tab'
import { ResolvedSettings } from '../../../void'

export let LayoutPanel = (props: { settings: ResolvedSettings }) => {
  let [, setConfig] = useConfig()
  let [tab] = useTab()
  let { settings } = props
  let { orientation } = settings
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">Layout</h2>
        <div className="flex items-center -my-1.5 -mr-2">
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.settings.orientation = 'portrait'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:bg-gray-100
              ${orientation === 'portrait' ? 'text-gray-600' : 'text-gray-300'}
            `}
          >
            <MdCrop169 className="transform rotate-90" />
          </button>
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.settings.orientation = 'landscape'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:bg-gray-100
              ${orientation === 'landscape' ? 'text-gray-600' : 'text-gray-300'}
            `}
          >
            <MdCrop169 />
          </button>
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.settings.orientation = 'square'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:bg-gray-100
              ${orientation === 'square' ? 'text-gray-600' : 'text-gray-300'}
            `}
          >
            <MdCropSquare />
          </button>
        </div>
      </div>
      <DimensionsField settings={settings} />
      <MarginsField settings={settings} />
    </div>
  )
}
