import { NumberField } from './number-field'
import { State } from '../engine/sketch'
import {
  MdEast,
  MdFavorite,
  MdFavoriteBorder,
  MdFingerprint,
  MdGridView,
  MdWest,
} from 'react-icons/md'
import { Store, useUpdateStore } from '../contexts/store'
import { Popover } from '@headlessui/react'

export let SeedPanel = (props: { state: State; store: Store }) => {
  let { state, store } = props
  let updateStore = useUpdateStore()
  return (
    <div className="p-5 space-y-1">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold">Seed</h2>
        <div className="flex items-center -mr-1.5">
          <button
            className={`
                flex w-7 h-7 items-center justify-center text-base rounded hover:bg-gray-100
                ${store.seeds.includes(state.seed) ? '' : 'text-gray-400'} 
              `}
            onClick={() => {
              updateStore((s) => {
                let i = s.seeds.indexOf(state.seed)
                if (i < 0) s.seeds.push(state.seed)
                else s.seeds.splice(i, 1)
                s.seeds.sort((a, b) => a - b)
              })
            }}
          >
            {store.seeds.includes(state.seed) ? (
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
                          updateStore((s) => {
                            s.seed = seed
                          })
                          close()
                        }}
                        className={`
                      py-1 px-2.5 rounded
                      ${
                        seed === store.seed
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
        </div>{' '}
      </div>
      <div className="flex space-x-2 -mr-1.5">
        <NumberField
          icon={<MdFingerprint />}
          label="Seed"
          value={state.seed}
          step={1}
          min={0}
          max={9999}
          onChange={(seed) => {
            updateStore((s) => {
              s.seed = seed
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
              updateStore((s) => {
                s.seed = Math.max(0, state.seed - 1)
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
              updateStore((s) => {
                s.seed = Math.max(0, state.seed + 1)
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
