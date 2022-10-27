import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useTab } from '../../contexts/tab'
import { Settings } from 'void'

export let SeedPanel = (props: { settings: Settings }) => {
  let [, changeTab] = useTab()
  let { settings } = props
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">Seed</h2>
        <div className="flex items-center -my-1.5 -mr-2">
          <button
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              text-gray-300 hover:text-black hover:bg-gray-100
            `}
            onClick={() => {
              changeTab((t) => {
                t.options.seed = Math.max(0, settings.seed - 1)
              })
            }}
          >
            <MdWest />
          </button>
          <button
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              text-gray-300 hover:text-black hover:bg-gray-100
            `}
            onClick={() => {
              changeTab((t) => {
                t.options.seed = Math.max(0, settings.seed + 1)
              })
            }}
          >
            <MdEast />
          </button>
        </div>
      </div>
      <div>
        <NumberField
          icon={<MdFingerprint />}
          label="Seed"
          value={settings.seed}
          step={1}
          min={0}
          max={9999}
          onChange={(seed) => {
            changeTab((t) => {
              t.options.seed = seed
            })
          }}
        />
      </div>
    </div>
  )
}
