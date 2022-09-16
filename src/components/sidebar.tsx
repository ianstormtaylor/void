import React from 'react'
import { NumberField } from './number-field'
import { State } from '../engine/sketch'
import { capitalCase } from 'change-case'
import { ColorField } from './color-field'
import { DimensionsField } from './dimensions-field'
import { MarginsField } from './margins-field'
import {
  MdCrop169,
  MdCropSquare,
  MdEast,
  MdFavorite,
  MdFavoriteBorder,
  MdFingerprint,
  MdGridView,
  MdReplay,
  MdResetTv,
  MdUndo,
  MdWest,
} from 'react-icons/md'
import { Store, useUpdateStore } from '../contexts/store'
import { SeedPanel } from './seed-panel'
import { ExportPanel } from './export-panel'
import { ZoomField } from './zoom-field'
import { BooleanField } from './boolean-field'
import { IconButton } from './icon-button'

export let Sidebar = (props: { state: State; store: Store }) => {
  let updateStore = useUpdateStore()
  let { state, store } = props
  let { orientation } = state
  return (
    <div className="text-xs">
      <Section>
        <div className="flex justify-between pb-1.5">
          <h2 className="font-semibold">Layout</h2>
          <div className="flex items-center -my-1.5 -mr-1.5">
            <button
              onClick={() => {
                updateStore((s) => {
                  s.orientation = 'portrait'
                })
              }}
              className={`
                flex w-7 h-7 items-center justify-center text-base rounded
                hover:bg-gray-100
                ${
                  orientation === 'portrait' ? 'text-gray-600' : 'text-gray-300'
                }
              `}
            >
              <MdCrop169 className="transform rotate-90" />
            </button>
            <button
              onClick={() => {
                updateStore((s) => {
                  s.orientation = 'landscape'
                })
              }}
              className={`
                flex w-7 h-7 items-center justify-center text-base rounded
                hover:bg-gray-100
                ${
                  orientation === 'landscape'
                    ? 'text-gray-600'
                    : 'text-gray-300'
                }
              `}
            >
              <MdCrop169 />
            </button>
            <button
              onClick={() => {
                updateStore((s) => {
                  s.orientation = 'square'
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
        <DimensionsField state={state} />
        <MarginsField state={state} />
        <ZoomField />
        {/* <ColorField label="Background" value="#FFFFFF" onChange={() => {}} /> */}
      </Section>
      <Separator />
      <SeedPanel state={state} store={store} />
      <Separator />
      <Section>
        <Header>Variables</Header>
        {Object.entries(state.controls).map(([key, control]) => {
          let field: React.ReactNode | undefined

          if (control.type === 'number') {
            field = (
              <NumberField
                label={capitalCase(key)}
                step={control.step}
                min={control.min}
                max={control.max}
                value={state.vars[key]}
                valueClassName={key in store.variables ? 'font-bold' : ''}
                onChange={(value) => {
                  updateStore((s) => {
                    s.variables[key] = value
                  })
                }}
              />
            )
          } else if (control.type === 'boolean') {
            field = (
              <BooleanField
                value={state.vars[key]}
                valueClassName={key in store.variables ? 'font-bold' : ''}
                label={capitalCase(key)}
                onChange={(value) => {
                  updateStore((s) => {
                    s.variables[key] = value
                  })
                }}
              />
            )
          } else {
            throw new Error(`Unhandled control type: ${control.type}`)
          }

          return (
            <div key={key} className="flex items-center">
              <div className="flex-1">{field}</div>
              {key in store.variables ? (
                <div className="ml-2.5 -mr-1.5">
                  <IconButton
                    title="Reset"
                    onClick={() => {
                      updateStore((s) => {
                        delete s.variables[key]
                      })
                    }}
                  >
                    <MdReplay />
                  </IconButton>
                </div>
              ) : null}
            </div>
          )
        })}
      </Section>
      <Separator />
      {/* <Section>
        <Header>Layers</Header>
        {layers
          .slice()
          .reverse()
          .map((layer) => {
            return (
              <LayerField
                key={layer.name}
                name={layer.name}
                fill={layer.fill}
                stroke={layer.stroke}
                hidden={store.hiddens.includes(layer.name)}
                toggle={() => {
                  updateStore((s) => {
                    let i = s.hiddens.indexOf(layer.name)
                    if (i < 0) s.hiddens.push(layer.name)
                    else s.hiddens.splice(i, 1)
                  })
                }}
              />
            )
          })}
      </Section> */}
      <ExportPanel state={state} />
    </div>
  )
}

let Separator = () => {
  return <div className="border-t border-gray-200" />
}

let Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-5 space-y-1" children={children} />
}

let Header = ({ children }: { children: React.ReactNode }) => {
  return <h2 className="font-semibold pb-1.5" children={children} />
}
