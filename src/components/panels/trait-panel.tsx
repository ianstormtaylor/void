import { useSettings } from '../../contexts/settings'
import { TraitField } from '../fields/trait-field'

export let TraitPanel = () => {
  let settings = useSettings()
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <h2 className="font-semibold pb-1.5">Traits</h2>
      {Object.entries(settings.schema).map(([key, trait]) => (
        <TraitField key={key} prop={key} trait={trait} />
      ))}
    </div>
  )
}
