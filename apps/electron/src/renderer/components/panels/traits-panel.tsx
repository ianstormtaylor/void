import plur from 'plur'
import { MdClear } from 'react-icons/md'
import { useSketch } from '../../contexts/sketch'
import { useTab } from '../../contexts/tab'
import { TraitField } from '../fields/trait-field'
import { IconButton } from '../ui/icon-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let TraitsPanel = () => {
  let sketch = useSketch()
  let [tab, changeTab] = useTab()
  let count = Object.keys(sketch.traits).length
  let sketchHas = count > 0
  let tabHas = Object.keys(tab.traits).length > 0
  return (
    <SidebarPanel
      title="Traits"
      initialExpanded={count > 0}
      summary={`${count} ${plur('trait', count)}`}
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
        Object.keys(sketch.schemas ?? {}).map((name) => (
          <TraitField key={name} name={name} />
        ))
      ) : (
        <div className="text-gray-400 pb-2">No traits were defined.</div>
      )}
    </SidebarPanel>
  )
}
