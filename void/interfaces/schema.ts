import { mergeWith } from 'lodash'
import { Settings } from './settings'
import { Traits } from './traits'

/** A configuration for the UI controls for a variable. */
export type TraitSchema = NumberSchema | EnumSchema | BooleanSchema

export type NumberSchema = {
  type: 'number'
  step: number
  min: number
  max: number
}

export type EnumSchema = {
  type: 'enum'
  options: string[]
  weights: number[]
}

export type BooleanSchema = {
  type: 'boolean'
}

/** A schema definition for a sketch. */
export type Schema<T extends Traits> = Record<keyof T, TraitSchema>

export let Schema = {
  /** Merge multiple `...schemas` into one. */
  merge<T extends Traits>(...schemas: Schema<T>[]): Schema<T> {
    return mergeWith({}, ...schemas, (a: Schema<T>, b: Schema<T>) => {
      if (Array.isArray(a)) return b
    })
  },

  /** Resolve an implicit schema from a sketch's `Settings`. */
  resolve<T extends Traits>(settings: Settings<T>): Schema<T> {
    let { schema = {} as Schema<T>, traits = {} as T } = settings
    let ret: Partial<Record<keyof T, TraitSchema>> = {}

    for (let [key, value] of Object.entries(traits)) {
      let k = key as keyof T
      let s = schema[k]

      // Boolean traits.
      if (typeof value === 'boolean') {
        ret[k] = { type: 'boolean' }
        continue
      }

      // Number traits.
      if (typeof value === 'number') {
        let min =
          s != null && 'min' in s && typeof s.min === 'number' ? s.min : null
        let max =
          s != null && 'max' in s && typeof s.max === 'number' ? s.max : null
        let step =
          s != null && 'step' in s && typeof s.step === 'number' ? s.step : null
        ret[k] = {
          type: 'number',
          min: min ?? -Infinity,
          max: max ?? Infinity,
          step: step ?? getStep(value),
        }
        continue
      }

      // Enum traits.
      if (s != null && 'options' in s && Array.isArray(s.options)) {
        let { options } = s
        ret[k] = {
          type: 'enum',
          options,
          weights: options.map(() => 1),
        }
      }
    }

    return ret as any
  },
}

/** A partial schema definition for a sketch. */
export type PartialSchema<T extends Traits> = Partial<
  Record<keyof T, Partial<TraitSchema>>
>

/** Get a default incrementing/decrementing amount for a varible of `value`. */
function getStep(value: number): number {
  let step = 0
  let abs = Math.abs(value)

  if (Number.isInteger(value)) {
    if (value % 1000 === 0 && abs >= 5000) step = 1000
    if (value % 500 === 0 && abs >= 2000) step = 500
    if (value % 100 === 0 && abs >= 600) step = 100
    if (value % 50 === 0 && abs >= 350) step = 50
    if (value % 25 === 0 && abs >= 175) step = 25
    if (value % 10 === 0 && abs >= 50) step = 10
    if (value % 5 === 0 && abs >= 25) step = 5
    else step = 1
  } else {
    if (value % 0.5 === 0 && abs >= 2.5) step = 0.5
    else if (value % 0.25 === 0 && abs >= 0.75) step = 0.25
    else if (value % 0.1 === 0 && abs >= 0.3) step = 0.1
    else if (value % 0.05 === 0 && abs >= 0.05) step = 0.05
    else step = 0.01
  }

  return step
}
