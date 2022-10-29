import { MdClear } from 'react-icons/md'
import { Schema, Traits } from 'void'
import { useTab } from '../../contexts/tab'
import { TraitField } from '../fields/trait-field'
import { IconButton } from '../ui/icon-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let TraitPanel = (props: { schema: Schema; traits: Traits }) => {
  let { schema, traits } = props
  let [tab, changeTab] = useTab()
  let has = Object.keys(tab.traits).length > 0
  return (
    <SidebarPanel
      title="Traits"
      buttons={
        <>
          <IconButton
            title="Unlock All"
            className={has ? 'flex' : 'hidden'}
            onClick={() => {
              changeTab((t) => {
                t.traits = {}
              })
            }}
          >
            <MdClear />
          </IconButton>
        </>
      }
    >
      {Object.entries(schema).map(([key, trait]) => (
        <TraitField key={key} prop={key} schema={trait} value={traits[key]} />
      ))}
    </SidebarPanel>
  )
}
