import { MdClear } from 'react-icons/md'
import { useSketch } from '../../contexts/sketch'
import { useTab } from '../../contexts/tab'
import { TraitField } from '../fields/trait-field'
import { IconButton } from '../ui/icon-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let TraitsPanel = () => {
  let sketch = useSketch()
  let [tab, changeTab] = useTab()
  let sketchHas = Object.keys(sketch.traits).length > 0
  let tabHas = Object.keys(tab.traits).length > 0
  return (
    <SidebarPanel
      title="Traits"
      buttons={
        <>
          <IconButton
            title="Unlock All"
            className={tabHas ? 'flex' : 'hidden'}
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
      {sketchHas ? (
        Object.entries(sketch.schemas).map(([key, schema]) => (
          <TraitField
            key={key}
            prop={key}
            schema={schema}
            value={sketch.traits[key]}
          />
        ))
      ) : (
        <div className="text-gray-400 pb-2">No traits were defined.</div>
      )}
    </SidebarPanel>
  )
}
