import { useCallback } from 'react'
import { NumberField } from './number-field'
import { capitalCase } from 'change-case'
import { BooleanField } from './boolean-field'
import { useTab } from '../../contexts/tab'
import { AnySchema, Generate } from 'void'
import { IconButton } from '../ui/icon-button'
import {
  MdOutlineAutoAwesome,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { EnumField } from './enum-field'

export let TraitField = (props: {
  prop: string
  schema: AnySchema
  value: any
}) => {
  let { prop: key, schema, value } = props
  let [tab, changeTab] = useTab()
  let label = capitalCase(key)
  let has = tab.traits != null && key in tab.traits
  let valueClassName = has ? 'font-bold' : ''
  let field: React.ReactNode

  let onChange = useCallback(
    (value: any) => {
      changeTab((t) => {
        t.traits[key] = value
      })
    },
    [tab, key, changeTab]
  )

  if (schema.type === 'int' || schema.type === 'float') {
    field = (
      <NumberField
        label={label}
        step={schema.step ?? 0.001}
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
  } else if (schema.type === 'choice') {
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
              tab.traits != null && key in tab.traits ? tab.traits[key] : value

            let v = schema.type === 'boolean' ? !current : current
            while (v === current && attempts--) {
              v = Generate.any(schema, { evenly: true })
            }

            changeTab((t) => {
              t.traits[key] = v
            })
          }}
        >
          <MdOutlineAutoAwesome />
        </IconButton>
        <IconButton
          title="Lock"
          active={has}
          onClick={() => {
            changeTab((t) => {
              if (key in t.traits) {
                delete t.traits[key]
              } else {
                t.traits[key] = value
              }
            })
          }}
        >
          {has ? <MdOutlineLock /> : <MdOutlineLockOpen />}
        </IconButton>
      </div>
    </div>
  )
}
