import { useCallback } from 'react'
import { NumberField } from '../fields/number-field'
import { capitalCase } from 'change-case'
import { BooleanField } from '../fields/boolean-field'
import { useTab } from '../../contexts/tab'
import { Schema, TraitSchema } from '../../../void'
import { IconButton } from '../ui/icon-button'
import {
  MdOutlineAutoAwesome,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { EnumField } from './enum-field'

export let TraitField = (props: {
  prop: string
  schema: TraitSchema<any>
  value: any
}) => {
  let { prop: key, schema, value } = props
  let [tab, changeTab] = useTab()
  let label = capitalCase(key)
  let locked = tab.locks.includes(key)
  let has = tab.settings.traits != null && key in tab.settings.traits
  let valueClassName = `
    ${has ? 'font-bold' : ''}
    ${locked ? 'text-gray-400' : ''}
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

  let onReset = useCallback(() => {
    changeTab((t) => {
      let traits = (t.settings.traits = t.settings.traits ?? {})
      delete traits[key]
    })
  }, [tab, key, changeTab])

  if (schema.type === 'number') {
    field = (
      <NumberField
        label={label}
        step={schema.step}
        min={schema.min}
        max={schema.max}
        value={value}
        valueClassName={valueClassName}
        onChange={onChange}
        onReset={has ? onReset : undefined}
      />
    )
  } else if (schema.type === 'boolean') {
    field = (
      <BooleanField
        label={label}
        value={value}
        valueClassName={valueClassName}
        onChange={onChange}
        onReset={has ? onReset : undefined}
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
        onReset={has ? onReset : undefined}
      />
    )
  } else {
    throw new Error(`Unhandled trait type: ${schema.type}`)
  }

  return (
    <div key={key} className="group flex items-center">
      <div className="flex-1 mr-3">{field}</div>
      <div className=" flex -mr-2">
        <IconButton
          title="Auto-generate"
          className="opacity-0 group-hover:opacity-100"
          onClick={() => {
            let attempts = 5
            let v = schema.type === 'boolean' ? !value : value

            while (v === value && attempts--) {
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
            ${locked ? 'text-black opacity-100' : 'text-gray-400 opacity-50'}
          `}
          onClick={() => {
            changeTab((t) => {
              if (locked) {
                let i = t.locks.indexOf(key)
                if (i != -1) t.locks.splice(i, 1)
              } else {
                t.locks.push(key)
              }
            })
          }}
        >
          {locked ? <MdOutlineLock /> : <MdOutlineLockOpen />}
        </button>
      </div>
    </div>
  )
}
