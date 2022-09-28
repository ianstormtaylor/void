import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useConfig } from '../../contexts/config'
import { useScene } from '../../contexts/scene'
import { useTab } from '../../contexts/tab'

export let SeedPanel = () => {
  let [, updateConfig] = useConfig()
  let scene = useScene()
  let tab = useTab()
  return (
    <div className="p-5 space-y-1">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Seed</h2>
        {/* <div className="flex items-center -mr-1.5">
          <button
            className={`
                flex w-7 h-7 items-center justify-center text-base rounded hover:bg-gray-100
                ${store.seeds.includes(scene.seed) ? '' : 'text-gray-400'} 
              `}
            onClick={() => {
              updateConfig((s) => {
                let i = s.seeds.indexOf(scene.seed)
                if (i < 0) s.seeds.push(scene.seed)
                else s.seeds.splice(i, 1)
                s.seeds.sort((a, b) => a - b)
              })
            }}
          >
            {store.seeds.includes(scene.seed) ? (
              <MdFavorite />
            ) : (
              <MdFavoriteBorder />
            )}
          </button>
          <Popover className="relative">
            <Popover.Button
              className={`
                flex w-7 h-7 items-center justify-center text-base rounded
                text-gray-400 hover:bg-gray-100
              `}
            >
              <MdGridView />
            </Popover.Button>
            <Popover.Panel
              className={`
                absolute z-10 top-full right-0 mt-1 w-40 p-4
                bg-white border border-gray-200 rounded-md shadow-lg
              `}
            >
              {({ close }) => (
                <>
                  <div className="font-semibold mb-2">Saved Seeds</div>
                  <div className="flex flex-wrap gap-1">
                    {store.seeds.map((seed) => (
                      <button
                        key={seed}
                        onClick={() => {
                          updateConfig((s) => {
                            let t = s.tabs[tab.id]
                            t.settings.seed = seed
                          })
                          close()
                        }}
                        className={`
                          py-1 px-2.5 rounded
                          ${
                            seed === tab.settings.seed
                              ? 'text-white bg-black'
                              : 'bg-gray-100'
                          }
                        `}
                      >
                        {seed}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </Popover.Panel>
          </Popover>
        </div>{' '} */}
      </div>
      <div className="flex space-x-2 -mr-1.5">
        <NumberField
          icon={<MdFingerprint />}
          label="Seed"
          value={scene.seed}
          step={1}
          min={0}
          max={9999}
          onChange={(seed) => {
            updateConfig((c) => {
              let t = c.tabs[tab.id]
              t.settings.seed = seed
            })
          }}
        />
        <div className="flex items-center">
          <button
            className={`
              flex w-7 h-7 items-center justify-center text-base rounded
              text-gray-400 hover:bg-gray-100
            `}
            onClick={() => {
              updateConfig((c) => {
                let t = c.tabs[tab.id]
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
              updateConfig((c) => {
                let t = c.tabs[tab.id]
                t.settings.seed = Math.max(0, scene.seed + 1)
              })
            }}
          >
            <MdEast />
          </button>
        </div>
      </div>
    </div>
  )
}
