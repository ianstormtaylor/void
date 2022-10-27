/** A JSON-serializable value. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** A schema representing all the traits of a sketch. */
export type Schema = Record<string, AnySchema>

export type AnySchema =
  | BoolSchema
  | IntSchema
  | FloatSchema
  | ChoiceSchema
  | SampleSchema

export type BoolSchema = {
  type: 'boolean'
  probability: number
}

export type IntSchema = {
  type: 'int'
  min: number
  max: number
  step: number
}

export type FloatSchema = {
  type: 'float'
  min: number
  max: number
  step?: number
}
export type ChoiceSchema<V extends Json = any> = {
  type: 'choice'
  options: OptionSchema<V>[]
}

export type SampleSchema<V extends Json = any> = {
  type: 'sample'
  min: number
  max: number
  options: OptionSchema<V>[]
}

/** A schema for the options when making a choice. */
export type OptionSchema<V extends Json = any> = {
  type: 'option'
  name: string
  value: V
  weight: number
}
