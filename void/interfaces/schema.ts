import { Settings } from './settings'
import { Traits } from './traits'

export type ResolvedBooleanSchema<V extends boolean> = {
  type: 'boolean'
  default: V
}

export type ResolvedNumberSchema<V extends number> = {
  type: 'number'
  default: V
  step: number
  min: number
  max: number
}

export type ResolvedStringSchema<V extends string> = {
  type: 'string'
  default: V
}

export type ResolvedOptionSchema<V extends any> = {
  type: 'option'
  name: string
  value: V
  weight: number
}

export type ResolvedEnumSchema<V extends any> = {
  type: 'enum'
  default: V
  options: ResolvedOptionSchema<V>[]
}

export type ResolvedObjectSchema<V extends Record<string, any>> = {
  type: 'object'
  properties: {
    [K in keyof V]: ResolvedTraitSchema<V[K]>
  }
}

/** A configuration for the UI controls for a variable. */
export type ResolvedTraitSchema<V extends any> = V extends number
  ? ResolvedNumberSchema<V> | ResolvedEnumSchema<V>
  : V extends boolean
  ? ResolvedBooleanSchema<V> | ResolvedEnumSchema<V>
  : V extends string
  ? ResolvedStringSchema<V> | ResolvedEnumSchema<V>
  : V extends Record<string, any>
  ? ResolvedObjectSchema<V>
  : ResolvedEnumSchema<V>

/** A schema definition for a sketch. */
export type ResolvedSchema<T extends Traits> = {
  [K in keyof T]: ResolvedTraitSchema<T[K]>
}

type BooleanSchema = {}

type StringSchema = {}

type NumberSchema = {
  min?: number
  max?: number
  step?: number
}

type OptionSchema<V extends any> = {
  name: string
  value: V
  weight?: number
}

type EnumSchema<V extends any> = {
  options?: V[] | OptionSchema<V>[]
}

type ObjectSchema<V extends Record<string, any>> = {
  [K in keyof V]?: TraitSchema<V[K]>
}

export type TraitSchema<V extends any> = V extends number
  ? NumberSchema | EnumSchema<V>
  : V extends boolean
  ? BooleanSchema | EnumSchema<V>
  : V extends string
  ? StringSchema | EnumSchema<V>
  : V extends Record<string, any>
  ? ObjectSchema<V>
  : EnumSchema<V>

/** The schema definition for a sketch. */
export type Schema<T extends Traits> = {
  [K in keyof T]?: TraitSchema<T[K]>
}

export let Schema = {
  /** Resolve an implicit schema from a sketch's `Settings`. */
  resolve<T extends Traits>(settings: Settings<T>): ResolvedSchema<T> {
    let { schema = {} as ResolvedSchema<T>, traits = {} as T } = settings
    let ret = {} as any

    for (let key in traits) {
      let v = traits[key]
      let s = schema[key]
      let r = resolveTraitSchema(v, s)
      ret[key] = r
    }

    return ret as any
  },
}

/** Get a default stepping amount for a number trait of `value`. */
function getStep(value: number): number {
  let abs = Math.abs(value)
  if (value === 0) {
    return 0.1
  } else if (Number.isInteger(value)) {
    if (value % 1000 === 0 && abs >= 5000) return 1000
    if (value % 500 === 0 && abs >= 2000) return 500
    if (value % 100 === 0 && abs >= 600) return 100
    if (value % 50 === 0 && abs >= 350) return 50
    if (value % 25 === 0 && abs >= 175) return 25
    if (value % 10 === 0 && abs >= 50) return 10
    if (value % 5 === 0 && abs >= 25) return 5
    else return 1
  } else {
    if (value % 0.5 === 0 && abs >= 2.5) return 0.5
    else if (value % 0.25 === 0 && abs >= 0.75) return 0.25
    else if (value % 0.1 === 0 && abs >= 0.3) return 0.1
    else if (value % 0.05 === 0 && abs >= 0.05) return 0.05
    else return 0.01
  }
}

/** Resolve a `trait` schema with its default `value`. */
function resolveTraitSchema<V extends boolean>(
  value: V,
  trait?: BooleanSchema
): ResolvedBooleanSchema<V>
function resolveTraitSchema<V extends number>(
  value: number,
  trait?: NumberSchema
): ResolvedNumberSchema<V>
function resolveTraitSchema<V extends string>(
  value: string,
  trait?: StringSchema
): ResolvedStringSchema<V>
function resolveTraitSchema<V extends any>(
  value: V,
  trait?: EnumSchema<V>
): ResolvedEnumSchema<V>
function resolveTraitSchema<V extends Record<string, any>>(
  value: V,
  trait?: ObjectSchema<V>
): ResolvedObjectSchema<V>
function resolveTraitSchema<V extends any>(
  value: V,
  trait?: TraitSchema<V>
): ResolvedTraitSchema<V> {
  // Enum traits.
  if (
    typeof trait === 'object' &&
    trait != null &&
    'options' in trait &&
    trait.options != null
  ) {
    let options = resolveOptions(trait.options)
    return { type: 'enum', default: value, options } as any
  }

  // Boolean traits.
  if (typeof value === 'boolean') {
    return { type: 'boolean', default: value } as any
  }

  // String traits.
  if (typeof value === 'string') {
    return { type: 'string', default: value } as any
  }

  // Number traits.
  if (typeof value === 'number') {
    let min = -Infinity
    let max = Infinity
    let step = getStep(value)
    let t = trait as any

    if (typeof t === 'object' && t != null) {
      if ('min' in t && typeof t.min === 'number') min = t.min
      if ('max' in t && typeof t.max === 'number') max = t.max
      if ('step' in t && typeof t.step === 'number') step = t.step
    }

    return { type: 'number', default: value, min, max, step } as any
  }

  // Object traits.
  if (typeof value === 'object' && value != null) {
    let ret = {} as any

    for (let k in value) {
      let v = value[k]
      let t = trait != null ? (trait as any)[k] : undefined
      ret[k] = t ? resolveTraitSchema(v, t) : resolveTraitSchema(v)
    }

    return ret
  }

  throw new Error(`Cannot resolve schema for trait: "${value}"`)
}

/** Resolve an `options` schema. */
function resolveOptions<V extends any>(
  options: V[] | OptionSchema<V>[]
): ResolvedOptionSchema<V>[] {
  return options.map((op) => {
    if (typeof op === 'object' && op != null) {
      let { value, name = `${value}`, weight = 1 } = op as OptionSchema<V>
      return { type: 'option', value, name, weight }
    } else {
      let value = op
      let name = `${value}`
      let weight = 1
      return { type: 'option', value, name, weight }
    }
  })
}
