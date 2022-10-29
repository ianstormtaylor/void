import { NumberField } from '../fields/number-field'
import { MdEast, MdFingerprint, MdWest } from 'react-icons/md'
import { useTab } from '../../contexts/tab'
import { Settings } from 'void'
import { SidebarPanel } from '../ui/sidebar-panel'
import { IconButton } from '../ui/icon-button'

export let SeedPanel = (props: { settings: Settings }) => {
  let [, changeTab] = useTab()
  let { settings } = props
  return (
    <SidebarPanel
      title="Seed"
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
