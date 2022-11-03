/** A JSON-serializable value. */
export type Json =
  | null
  | boolean
  | number
  | string
  | Json[]
  | { [key: string]: Json }

/** The orientation of a set of dimensions. */
export type Orientation = 'square' | 'portrait' | 'landscape'

/** Sizes of length `N`, with specific units. */
export type Sizes<N extends number, T extends number[] = []> = T extends {
  length: N
}
  ? [...T, Units]
  : Sizes<N, [...T, number]>

/** The unit of measurement for the canvas. */
export type Units = 'm' | 'cm' | 'mm' | 'in' | 'ft' | 'yd' | 'pt' | 'pc' | 'px'

/** Types of unit systems. */
export type UnitsSystem = 'metric' | 'imperial'

/** A schema which defines the values of a trait. */
export type Schema =
  | BoolSchema
  | IntSchema
  | FloatSchema
  | ChoiceSchema
  | SampleSchema

/** A schema for boolean traits. */
export type BoolSchema = {
  type: 'boolean'
  probability: number
}

/** A schema for integer traits. */
export type IntSchema = {
  type: 'int'
  min: number
  max: number
  step: number
}

/** A schema for floating point number traits. */
export type FloatSchema = {
  type: 'float'
  min: number
  max: number
  step?: number
}

/** A schema for enum traits. */
export type ChoiceSchema<V = any> = {
  type: 'choice'
  options: OptionSchema<V>[]
}

/** A schema for enum-like traits where multiple choices are sampled. */
export type SampleSchema<V = any> = {
  type: 'sample'
  min: number
  max: number
  options: OptionSchema<V>[]
}

/** A schema for the individual options/choices when making a choice. */
export type OptionSchema<V = any> = {
  type: 'option'
  name: string
  value: V
  weight: number
}
