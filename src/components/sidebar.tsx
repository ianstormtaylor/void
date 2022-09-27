import React from 'react'
import { NumberField } from './number-field'
import { State } from '../../electron/shared/engine/sketch'
import { capitalCase } from 'change-case'
import { DimensionsField } from './dimensions-field'
import { MarginsField } from './margins-field'
import { MdCrop169, MdCropSquare, MdReplay } from 'react-icons/md'
import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { BooleanField } from './boolean-field'
import { IconButton } from './icon-button'
import { TabConfig } from 'electron/shared/config'
import { useConfig } from '@/contexts/config'

export let Sidebar = (props: { state: State; tab: TabConfig }) => {
  let { state, tab } = props
  let [, setConfig] = useConfig()
  let { orientation } = state
  return (
    <div className="text-xs">
      <Section>
        <div className="flex justify-between pb-1.5">
          <h2 className="font-semibold">Layout</h2>
          <div className="flex items-center -my-1.5 -mr-1.5">
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
                ${
                  orientation === 'portrait' ? 'text-gray-600' : 'text-gray-300'
                }
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
        <DimensionsField state={state} />
        <MarginsField state={state} />
      </Section>
      <Separator />
      <SeedPanel state={state} tab={tab} />
      <Separator />
      <Section>
        <Header>Traits</Header>
        {Object.entries(state.schema).map(([key, control]) => {
          let field: React.ReactNode | undefined

          if (control.type === 'number') {
            field = (
              <NumberField
                label={capitalCase(key)}
                step={control.step}
                min={control.min}
                max={control.max}
                value={state.traits[key]}
                valueClassName={
                  tab.settings.traits != null && key in tab.settings.traits
                    ? 'font-bold'
                    : ''
                }
                onChange={(value) => {
                  setConfig((s) => {
                    let t = s.tabs[tab.id]
                    let traits = (t.settings.traits = t.settings.traits ?? {})
                    traits[key] = value
                  })
                }}
              />
            )
          } else if (control.type === 'boolean') {
            field = (
              <BooleanField
                value={state.traits[key]}
                valueClassName={
                  tab.settings.traits != null && key in tab.settings.traits
                    ? 'font-bold'
                    : ''
                }
                label={capitalCase(key)}
                onChange={(value) => {
                  setConfig((s) => {
                    let t = s.tabs[tab.id]
                    let traits = (t.settings.traits = t.settings.traits ?? {})
                    traits[key] = value
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
              {tab.settings.traits != null && key in tab.settings.traits ? (
                <div className="ml-2.5 -mr-1.5">
                  <IconButton
                    title="Reset"
                    onClick={() => {
                      setConfig((s) => {
                        let t = s.tabs[tab.id]
                        let traits = (t.settings.traits =
                          t.settings.traits ?? {})
                        delete traits[key]
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
