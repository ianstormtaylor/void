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
  | SchemaBool
  | SchemaInt
  | SchemaFloat
  | SchemaChoice
  | SchemaSample

/** A schema for boolean traits. */
export type SchemaBool = {
  type: 'boolean'
  probability: number
}

/** A schema for integer traits. */
export type SchemaInt = {
  type: 'int'
  min: number
  max: number
  step: number
}

/** A schema for floating point number traits. */
export type SchemaFloat = {
  type: 'float'
  min: number
  max: number
  step?: number
}

/** A schema for enum traits. */
export type SchemaChoice<V = any> = {
  type: 'choice'
  options: OptionSchema<V>[]
}

/** A schema for enum-like traits where multiple choices are sampled. */
export type SchemaSample<V = any> = {
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
