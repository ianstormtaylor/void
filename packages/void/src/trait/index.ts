import { Json, OptionSchema, Schema, TraitSchema } from '../interfaces/schema'

/** Define a trait by `name` with a specific schema. */
export function trait(name: string): boolean
export function trait(
  name: string,
  min: number,
  max: number,
  step?: number
): number
export function trait<V extends Json>(
  name: string,
  choices: Exclude<V, any[]>[] | [number, V][]
): V
export function trait<V extends Json>(
  name: string,
  choices: Record<string, Exclude<V, any[]> | [number, V]>
): V
export function trait<V extends Json>(
  name: string,
  schema?:
    | number
    | Exclude<V, any[]>[]
    | [number, V][]
    | Record<string, [number, V] | V>,
  max?: number,
  step?: number
): V {
  let s: TraitSchema | undefined

  // Boolean traits.
  if (schema === undefined) {
    s = { type: 'boolean' }
  }

  // Number traits.
  if (typeof schema === 'number') {
    s = { type: 'number', min: schema, max: max!, step: step ?? null }
  }

  // Enum traits.
  if (typeof schema === 'object' && schema != null) {
    let options

    if (Array.isArray(schema)) {
      options = schema.map((sc) => {
        let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
        let name = `${value}`
        return { type: 'option', name, value, weight } as OptionSchema
      })
    } else {
      options = Object.entries(schema).map(([key, sc]) => {
        let [weight, value] = Array.isArray(sc) ? sc : [1, sc]
        return { type: 'option', name: key, value, weight } as OptionSchema
      })
    }

    s = { type: 'enum', options }
  }

  if (s == null) {
    throw new Error(`Cannot resolve trait's schema: "${schema}"`)
  }

  let value = Schema.generate(s)

  if (Void.traits != null && name in Void.traits) {
    value = Void.traits[name]
  } else if (
    Void.overrides != null &&
    Void.overrides.traits != null &&
    name in Void.overrides.traits
  ) {
    value = Void.overrides.traits[name]
  }

  Void.schema = Void.schema ?? {}
  Void.traits = Void.traits ?? {}
  Void.schema[name] = s
  Void.traits[name] = value
  return value
}
