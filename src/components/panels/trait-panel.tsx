import { Schema, Traits } from '../../../void'
import { TraitField } from '../fields/trait-field'

export let TraitPanel = (props: { traits: Traits; schema: Schema }) => {
  let { schema, traits } = props
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <h2 className="font-semibold pb-1.5">Traits</h2>
      {Object.entries(schema).map(([key, trait]) => (
        <TraitField key={key} prop={key} schema={trait} value={traits[key]} />
      ))}
    </div>
  )
}
