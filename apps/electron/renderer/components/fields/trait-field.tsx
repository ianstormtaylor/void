import { useCallback } from 'react'
import { NumberField } from './number-field'
import { capitalCase } from 'change-case'
import { BooleanField } from './boolean-field'
import { useTab } from '../../contexts/tab'
import { Schema, TraitSchema } from 'void'
import { IconButton } from '../ui/icon-button'
import {
  MdOutlineAutoAwesome,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { EnumField } from './enum-field'

export let TraitField = (props: {
  prop: string
  schema: TraitSchema
  value: any
}) => {
  let { prop: key, schema, value } = props
  let [tab, changeTab] = useTab()
  let label = capitalCase(key)
  let has = tab.settings.traits != null && key in tab.settings.traits
  let valueClassName = `
    ${has ? 'font-bold' : ''}
  `

  let field: React.ReactNode

  let onChange = useCallback(
    (value: any) => {
      changeTab((t) => {
        let traits = (t.settings.traits = t.settings.traits ?? {})
        traits[key] = value
      })
    },
    [tab, key, changeTab]
  )

  if (schema.type === 'number') {
    field = (
      <NumberField
        label={label}
        step={schema.step ?? 0.01}
        min={schema.min}
        max={schema.max}
        value={value}
        valueClassName={valueClassName}
        onChange={onChange}
      />
    )
  } else if (schema.type === 'boolean') {
    field = (
      <BooleanField
        label={label}
        value={value}
        valueClassName={valueClassName}
        onChange={onChange}
      />
    )
  } else if (schema.type === 'enum') {
    field = (
      <EnumField
        label={label}
        value={value}
        options={schema.options}
        valueClassName={valueClassName}
        onChange={onChange}
      />
    )
  } else {
    let n: never = schema
    throw new Error(`Unhandled schema: "${JSON.stringify(n)}"`)
  }

  return (
    <div key={key} className="group flex items-center">
      <div className="flex-1 mr-3">{field}</div>
      <div className=" flex -mr-2">
        <IconButton
          title="Auto-generate"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => {
            let attempts = 10
            let current =
              tab.settings.traits != null && key in tab.settings.traits
                ? tab.settings.traits[key]
                : value

            let v = schema.type === 'boolean' ? !current : current
            while (v === current && attempts--) {
              v = Schema.generate(schema)
            }

            changeTab((t) => {
              let traits = (t.settings.traits = t.settings.traits ?? {})
              traits[key] = v
            })
          }}
        >
          <MdOutlineAutoAwesome />
        </IconButton>
        <button
          title="Lock"
          className={`
            flex w-7 h-7 items-center justify-center text-base rounded
            hover:bg-gray-100 hover:text-black
            group-hover:opacity-100
            ${has ? 'text-black opacity-100' : 'text-gray-400 opacity-50'}
          `}
          onClick={() => {
            changeTab((t) => {
              let traits = (t.settings.traits = t.settings.traits ?? {})
              if (has) {
                delete traits[key]
              } else {
                traits[key] = value
              }
            })
          }}
        >
          {has ? <MdOutlineLock /> : <MdOutlineLockOpen />}
        </button>
      </div>
    </div>
  )
}
