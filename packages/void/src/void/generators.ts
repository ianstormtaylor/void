import {
  ChoiceSchema,
  SampleSchema,
  FloatSchema,
  IntSchema,
  Json,
  AnySchema,
  BoolSchema,
} from '../interfaces/schema'
import { Math, Random } from '..'

/** Generate any trait value from a `schema`. */
export function any(
  schema: AnySchema,
  options: {
    evenly?: boolean
  } = {}
): any {
  switch (schema.type) {
    case 'boolean':
      return bool(schema)
    case 'int':
      return int(schema)
    case 'float':
      return float(schema)
    case 'choice':
      return choice(schema, options)
    case 'sample':
      return sample(schema, options)
  }
}

/** Generate a random boolean from a `schema`. */
export function bool(schema: BoolSchema): boolean {
  return Random.bool(schema.probability)
}

/** Generate a random integer from a `schema`. */
export function int(schema: IntSchema): number {
  let { min, max, step } = schema
  let value = Random.int(0, max - min)
  return min + Math.round(value / step) * step
}

/** Generate a random float from a `schema`. */
export function float(schema: FloatSchema): number {
  let { min, max, step } = schema
  if (step == null) {
    return Random.float(min, max)
  } else {
    let value = Random.float(0, max - min + step)
    return min + Math.floor(value, step)
  }
}

/** Generate a random choice from a `schema`. */
export function choice<V extends Json>(
  schema: ChoiceSchema<V>,
  options: {
    evenly?: boolean
  } = {}
): V {
  let { options: choices } = schema
  let values: V[] = []
  let weights = []
  for (let choice of choices) {
    values.push(choice.value)
    weights.push(options.evenly ? 1 : choice.weight)
  }
  let value = Random.choice(values, weights)
  return value
}

/** Generate a random sample from a `schema`. */
export function sample<V extends Json>(
  schema: SampleSchema<V>,
  options: {
    evenly?: boolean
  } = {}
): V[] {
  let { options: choices, min, max } = schema
  let values: V[] = []
  let weights = []
  for (let choice of choices) {
    values.push(choice.value)
    weights.push(options.evenly ? 1 : choice.weight)
  }
  let amount = Random.int(min, max)
  let value = Random.sample(amount, values, weights)
  return value
}
