import { math } from '../math'
import { random } from '../random'

/** A JSON-serializable value. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** A schema representing all the traits of a sketch. */
export type Schema = Record<string, TraitSchema>

export const Schema = {
  /** Generate a new value for a trait's `schema`. */
  generate(schema: TraitSchema): any {
    switch (schema.type) {
      case 'boolean': {
        return random.bool()
      }

      case 'number': {
        let { min, max, step } = schema
        if (step == null) return random.float(min, max)
        let range = max - min
        let value = random.float(0, range + step)
        value = math.floor(value, step)
        return min + value
      }

      case 'enum': {
        let { options } = schema
        let values = []
        let weights = []
        for (let option of options) {
          values.push(option.value)
          weights.push(option.weight)
        }
        let value = random.item(values, weights)
        return value
      }

      default: {
        let n: never = schema
        throw new Error(`Unhandled schema: "${JSON.stringify(n)}"`)
      }
    }
  },
}

/** A schema that defines the values for a trait. */
export type TraitSchema = BooleanSchema | NumberSchema | EnumSchema

/** A schema for booleans. */
export type BooleanSchema = {
  type: 'boolean'
}

/** A schema for numbers. */
export type NumberSchema = {
  type: 'number'
  step: number | null
  min: number
  max: number
}

/** A schema for enumerations. */
export type EnumSchema = {
  type: 'enum'
  options: OptionSchema[]
}

/** A schema for the choices of enums. */
export type OptionSchema = {
  type: 'option'
  name: string
  value: Json
  weight: number
}
