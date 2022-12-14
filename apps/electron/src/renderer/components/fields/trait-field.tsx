import { useCallback } from 'react'
import { NumberField } from './number-field'
import { capitalCase } from 'change-case'
import { BooleanField } from './boolean-field'
import { useTab } from '../../contexts/tab'
import { IconButton } from '../ui/icon-button'
import { MdOutlineLock, MdOutlineLockOpen } from 'react-icons/md'
import { EnumField } from './enum-field'
import { useSketch } from '../../contexts/sketch'

export let TraitField = (props: { name: string }) => {
  let sketch = useSketch()
  let { name } = props
  let value = sketch.traits[name]
  let schema = sketch.schemas![name]
  let [tab, changeTab] = useTab()
  let label = capitalCase(name)
  let overridden = tab.traits != null && name in tab.traits
  let valueClassName = overridden ? 'font-bold' : ''
  let field: React.ReactNode

  let onChange = useCallback(
    (v: any) => {
      changeTab((t) => (t.traits[name] = v))
    },
    [changeTab]
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
  } else if (schema.type === 'pick') {
    field = (
      <EnumField
        label={label}
        value={value}
        options={schema.names}
        valueClassName={valueClassName}
        onChange={onChange}
      />
    )
  } else {
    let n: never = schema
    throw new Error(`Unhandled schema: "${JSON.stringify(n)}"`)
  }

  return (
    <div key={name} className="group flex items-center">
      <div className="flex-1 mr-3">{field}</div>
      <div className="flex -mr-2">
        <IconButton
          title="Lock"
          active={overridden}
          onClick={() => {
            changeTab((t) => {
              if (name in t.traits) {
                delete t.traits[name]
              } else {
                t.traits[name] = value
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
