import { MdClear } from 'react-icons/md'
import { Schema, Traits } from 'void'
import { useTab } from '../../contexts/tab'
import { TraitField } from '../fields/trait-field'

export let TraitPanel = (props: { traits: Traits; schema: Schema }) => {
  let { schema, traits } = props
  let [tab, changeTab] = useTab()
  let has = Object.keys(tab.settings?.traits ?? {}).length > 0
  return (
    <div className="p-4 pb-3 space-y-0.5">
      <div className="flex justify-between pb-1">
        <h2 className="font-semibold">Traits</h2>
        <div className="flex items-center -my-1.5 -mr-2">
          <button
            title="Unlock All"
            className={`
              w-7 h-7 items-center justify-center text-base rounded
              text-gray-300 hover:text-black hover:bg-gray-100
              ${has ? 'flex' : 'hidden'}
            `}
            onClick={() => {
              changeTab((t) => {
                t.settings.traits = {}
              })
            }}
          >
            <MdClear />
          </button>
        </div>
      </div>
      {Object.entries(schema).map(([key, trait]) => (
        <TraitField key={key} prop={key} schema={trait} value={traits[key]} />
      ))}
    </div>
  )
}
