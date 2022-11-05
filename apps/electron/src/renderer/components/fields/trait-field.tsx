import { useCallback } from 'react'
import { NumberField } from './number-field'
import { capitalCase } from 'change-case'
import { BooleanField } from './boolean-field'
import { useTab } from '../../contexts/tab'
import { Schema, Math, Random } from 'void'
import { IconButton } from '../ui/icon-button'
import {
  MdOutlineAutoAwesome,
  MdOutlineLock,
  MdOutlineLockOpen,
} from 'react-icons/md'
import { EnumField } from './enum-field'

export let TraitField = (props: {
  prop: string
  schema: Schema
  value: any
}) => {
  let { prop: key, schema, value } = props
  let [tab, changeTab] = useTab()
  let label = capitalCase(key)
  let overridden =
    tab.traits != null && key in tab.traits && tab.traits[key] === value
  let valueClassName = overridden ? 'font-bold' : ''
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
              v = generate(schema)
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
          active={overridden}
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
          {overridden ? <MdOutlineLock /> : <MdOutlineLockOpen />}
        </IconButton>
      </div>
    </div>
  )
}

/** Generate a trait value from a `schema`. */
export function generate(schema: Schema): any {
  switch (schema.type) {
    case 'boolean': {
      let { probability } = schema
      return Random.bool(probability)
    }
    case 'int': {
      let { min, max, step } = schema
      let value = Random.int(0, max - min)
      return min + Math.round(value / step) * step
    }
    case 'float': {
      let { min, max, step } = schema
      if (step == null) {
        return Random.float(min, max)
      } else {
        let value = Random.float(0, max - min + step)
        return min + Math.floor(value, step)
      }
    }
    case 'choice': {
      let { options } = schema
      let values = options.map((o) => o.value)
      let value = Random.choice(values)
      return value
    }
    case 'sample': {
      let { options, min, max } = schema
      let values = options.map((c) => c.value)
      let amount = Random.int(min, max)
      let value = Random.sample(amount, values)
      return value
    }
  }
}
