import React from 'react'
import { NumberField } from './fields/number-field'
import { capitalCase } from 'change-case'
import { DimensionsField } from './fields/dimensions-field'
import { MarginsField } from './fields/margins-field'
import { MdCrop169, MdCropSquare, MdReplay } from 'react-icons/md'
import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { BooleanField } from './fields/boolean-field'
import { IconButton } from './ui/icon-button'
import { useConfig } from '../contexts/config'
import { useTab } from '../contexts/tab'
import { useScene } from '../contexts/scene'
import { useSettings } from '../contexts/settings'

export let EditorSidebar = () => {
  let [, setConfig] = useConfig()
  let tab = useTab()
  let scene = useScene()
  let settings = useSettings()
  let { orientation } = scene
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
        <DimensionsField />
        <MarginsField />
      </Section>
      <Separator />
      <SeedPanel />
      <Separator />
      <Section>
        <Header>Traits</Header>
        {Object.entries(settings.schema).map(([key, control]) => {
          let field: React.ReactNode | undefined

          if (control.type === 'number') {
            field = (
              <NumberField
                label={capitalCase(key)}
                step={control.step}
                min={control.min}
                max={control.max}
                value={scene.traits[key]}
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
                value={scene.traits[key]}
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
      <ExportPanel />
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
