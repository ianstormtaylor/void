import {
  BooleanSchema,
  EnumSchema,
  Json,
  NullSchema,
  NumberSchema,
  OptionSchema,
  Schema,
  StringSchema,
  TraitSchema,
} from '../interfaces/schema'

/** Options for specifying a number trait. */
export type NumberOptions = {
  min?: number
  max?: number
  step?: number
}

/** Options when specifying an enum trait. */
export type EnumOptions<V extends Json> = {
  options?: V[] | OptionOptions<V>[]
}

/** Options when specifying an enum trait's choices. */
export type OptionOptions<V extends Json> = {
  name: string
  value: V
  weight?: number
}

/** Define and return a trait with `name` and `initial` value. */
export function trait(name: string, initial: null): null
export function trait(name: string, initial: boolean): boolean
export function trait(name: string, initial: string): string
export function trait(
  name: string,
  initial: number,
  options?: NumberOptions
): number
export function trait<V extends Json>(
  name: string,
  choices: V[] | OptionOptions<V>[]
): V
export function trait<V extends Json>(
  name: string,
  initial: V,
  options: EnumOptions<V>
): V
export function trait<V extends Json>(
  name: string,
  initial: V | V[],
  options?: NumberOptions | EnumOptions<V>
): V {
  if (Void.schema == null || Void.traits == null) {
    throw new Error(`Cannot call trait() before calling setup() for a sketch!`)
  }

  if (name in Void.traits) {
    return Void.traits[name]
  }

  // @ts-ignore
  let s = resolveSchema(initial, options) as Schema<V>
  let v = s.default as V

  if (
    Void.overrides != null &&
    Void.overrides.traits != null &&
    name in Void.overrides.traits
  ) {
    v = Void.overrides.traits[name]
  }

  Void.schema[name] = s
  Void.traits[name] = v
  return v
}

/** Resolve a trait's schema from its `initial` value and `options`. */
export function resolveSchema(initial: null): NullSchema
export function resolveSchema(initial: boolean): BooleanSchema
export function resolveSchema(initial: string): StringSchema
export function resolveSchema(
  initial: number,
  options?: NumberOptions
): NumberSchema
export function resolveSchema<V extends Json>(
  choices: V[] | OptionOptions<V>[]
): EnumSchema<V>
export function resolveSchema<V extends Json>(
  initial: V,
  options: EnumOptions<V>
): EnumSchema<V>
export function resolveSchema<V extends Json>(
  initial: V | V[],
  options?: NumberOptions | EnumOptions<V>
): TraitSchema<V> {
  // Enum traits.
  if (
    typeof options === 'object' &&
    options != null &&
    'options' in options &&
    options.options != null
  ) {
    let choices = resolveOptions(options.options)
    return { type: 'enum', default: initial, options: choices } as any
  }

  // Null traits.
  if (initial === null) {
    return { type: 'null', default: null } as any
  }

  // Boolean traits.
  if (typeof initial === 'boolean') {
    return { type: 'boolean', default: initial } as any
  }

  // String traits.
  if (typeof initial === 'string') {
    return { type: 'string', default: initial } as any
  }

  // Number traits.
  if (typeof initial === 'number') {
    let min = -Infinity
    let max = Infinity
    let step = resolveStep(initial)
    let t = options as any

    if (typeof t === 'object' && t != null) {
      if ('min' in t && typeof t.min === 'number') min = t.min
      if ('max' in t && typeof t.max === 'number') max = t.max
      if ('step' in t && typeof t.step === 'number') step = t.step
    }

    return { type: 'number', default: initial, min, max, step } as any
  }

  // Array enum traits.
  if (Array.isArray(initial)) {
    let choices = resolveOptions(initial as V[])
    return { type: 'enum', default: choices[0].value, options: choices } as any
  }

  // Object traits.
  // if (typeof initial === 'object' && initial != null) {
  //   let ret = {} as any

  //   for (let k in initial) {
  //     let v = initial[k]
  //     let t = options != null ? (options as any)[k] : undefined
  //     ret[k] = t ? resolveSchema(v, t) : resolveSchema(v)
  //   }

  //   return ret
  // }

  throw new Error(`Cannot resolve schema for trait: "${initial}"`)
}

/** Resolve an `options` schema. */
function resolveOptions<V extends Json>(
  options: V[] | OptionOptions<V>[]
): OptionSchema<V>[] {
  return options.map((op) => {
    if (typeof op === 'object' && op != null) {
      let { value, name = `${value}`, weight = 1 } = op as OptionSchema<V>
      return { type: 'option', value, name, weight }
    } else {
      return { type: 'option', value: op, name: `${op}`, weight: 1 }
    }
  })
}

/** Get a default stepping amount for a number trait of `value`. */
function resolveStep(value: number): number {
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
