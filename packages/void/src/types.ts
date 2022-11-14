/** A type that can be converted to a stringified name easily. */
export type Nameable = string | number | boolean | null

/** Convert a type to a `Nameable` type. */
export type Nameify<T> = T extends Nameable ? T : string

/** A type that when used in generics allows narrowing of return values. */
export type Narrowable =
  | string
  | number
  | bigint
  | boolean
  | symbol
  | object
  | undefined
  | void
  | null
  | {}

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
export type Schema = SchemaBool | SchemaInt | SchemaFloat | SchemaPick

/** A schema for boolean traits. */
export type SchemaBool = {
  type: 'boolean'
  probability: number
  initial?: boolean
}

/** A schema for integer traits. */
export type SchemaInt = {
  type: 'int'
  min: number
  max: number
  step: number
  initial?: number
}

/** A schema for floating point number traits. */
export type SchemaFloat = {
  type: 'float'
  min: number
  max: number
  step?: number
  initial?: number
}

/** A schema for enum traits. */
export type SchemaPick = {
  type: 'pick'
  names: string[]
  weights: number[]
  initial?: string
}
