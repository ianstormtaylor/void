/** A JSON-serializable value. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** A schema representing all the traits of a sketch. */
export type Schema = Record<string, TraitSchema<any>>

export const Schema = {
  /** Generate a new value for a trait's `schema`. */
  generate(schema: TraitSchema<any>): any {
    switch (schema.type) {
      case 'null': {
        return null
      }

      case 'boolean': {
        return Math.random() > 0.5
      }

      case 'string': {
        return schema.default
      }

      case 'number': {
        let { min, max, step, default: def } = schema
        if (min == -Infinity)
          min = def === 0 ? 0 : def > 0 ? step : def - step * 10
        if (max == Infinity) max = def + step * 10
        let r = min + Math.random() * (max - min)
        r = Math.round(r / step) * step
        return r
      }

      case 'enum': {
        let { options } = schema
        let total = options.reduce((m, o) => m + o.weight, 0)
        let r = Math.random() * total
        let c = 0
        let i = options.findIndex((o) => r < (c += o.weight))
        let option = options[i]
        return option.value
      }

      default: {
        let n: never = schema
        throw new Error(`Unhandled schema: "${JSON.stringify(n)}"`)
      }
    }
  },
}

/** A schema that defines the values for a trait. */
export type TraitSchema<V extends Json> = V extends null
  ? NullSchema | EnumSchema<V>
  : V extends number
  ? NumberSchema | EnumSchema<V>
  : V extends boolean
  ? BooleanSchema | EnumSchema<V>
  : V extends string
  ? StringSchema | EnumSchema<V>
  : EnumSchema<V>

/** A schema for `null` values. */
export type NullSchema = {
  type: 'null'
  default: null
}

/** A schema for booleans. */
export type BooleanSchema = {
  type: 'boolean'
  default: boolean
}

/** A schema for numbers. */
export type NumberSchema = {
  type: 'number'
  default: number
  step: number
  min: number
  max: number
}

/** A schema for strings. */
export type StringSchema = {
  type: 'string'
  default: string
}

/** A schema for enumerations. */
export type EnumSchema<V extends Json> = {
  type: 'enum'
  default: V
  options: OptionSchema<V>[]
}

/** A schema for the choices of enums. */
export type OptionSchema<V extends Json> = {
  type: 'option'
  name: string
  value: V
  weight: number
}
