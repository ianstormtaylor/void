import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useScene } from '../../contexts/scene'
import { useTab } from '../../contexts/tab'

export let SeedPanel = () => {
  let scene = useScene()
  let [, changeTab] = useTab()
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">Seed</h2>
        <div className="flex items-center -my-1.5 -mr-2">
          <button
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              text-gray-400 hover:bg-gray-100
            `}
            onClick={() => {
              changeTab((t) => {
                t.settings.seed = Math.max(0, scene.seed - 1)
              })
            }}
          >
            <MdWest />
          </button>
          <button
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              text-gray-400 hover:bg-gray-100
            `}
            onClick={() => {
              changeTab((t) => {
                t.settings.seed = Math.max(0, scene.seed + 1)
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
          value={scene.seed}
          step={1}
          min={0}
          max={9999}
          onChange={(seed) => {
            changeTab((t) => {
              t.settings.seed = seed
            })
          }}
        />
      </div>
    </div>
  )
}
