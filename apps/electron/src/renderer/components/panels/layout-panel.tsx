import { DimensionsField } from '../fields/dimensions-field'
import { MarginsField } from '../fields/margins-field'
import { MdCrop169, MdCropSquare } from 'react-icons/md'
import { useStore } from '../../contexts/store'
import { useTab } from '../../contexts/tab'
import { Config } from 'void'

export let LayoutPanel = (props: { config: Config }) => {
  let [, setConfig] = useStore()
  let [tab] = useTab()
  let { config } = props
  let { orientation } = config
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">Layout</h2>
        <div className="flex items-center -my-1.5 -mr-2">
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.options.orientation = 'portrait'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:text-black hover:bg-gray-100
              ${orientation === 'portrait' ? 'text-black' : 'text-gray-300'}
            `}
          >
            <MdCrop169 className="transform rotate-90" />
          </button>
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.options.orientation = 'landscape'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:text-black hover:bg-gray-100
              ${orientation === 'landscape' ? 'text-black' : 'text-gray-300'}
            `}
          >
            <MdCrop169 />
          </button>
          <button
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.options.orientation = 'square'
              })
            }}
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              hover:text-black hover:bg-gray-100
              ${orientation === 'square' ? 'text-black' : 'text-gray-300'}
            `}
          >
            <MdCropSquare />
          </button>
        </div>
      </div>
      <DimensionsField config={config} />
      <MarginsField config={config} />
    </div>
  )
}
