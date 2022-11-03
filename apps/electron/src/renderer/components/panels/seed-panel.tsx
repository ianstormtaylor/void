import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useTab } from '../../contexts/tab'
import { Sketch } from 'void'
import { SidebarPanel } from '../ui/sidebar-panel'
import { IconButton } from '../ui/icon-button'

export let SeedPanel = (props: { sketch: Sketch }) => {
  let [, changeTab] = useTab()
  let { sketch } = props
  let { settings } = sketch
  return (
    <SidebarPanel
      title="Seed"
      summary={settings.seed}
      buttons={
        <>
          <IconButton
            onClick={() => {
              changeTab((t) => {
                t.config.seed = Math.max(0, settings.seed - 1)
              })
            }}
          >
            <MdWest />
          </IconButton>
          <IconButton
            onClick={() => {
              changeTab((t) => {
                t.config.seed = Math.max(0, settings.seed + 1)
              })
            }}
          >
            <MdEast />
          </IconButton>
        </>
      }
    >
      <NumberField
        icon={<MdFingerprint />}
        label="Seed"
        value={settings.seed}
        step={1}
        min={0}
        max={9999}
        onChange={(seed) => {
          changeTab((t) => {
            t.config.seed = seed
          })
        }}
      />
    </SidebarPanel>
  )
}
