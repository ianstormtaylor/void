import { DimensionsField } from '../fields/dimensions-field'
import { MarginsField } from '../fields/margins-field'
import { MdCrop169, MdCropSquare } from 'react-icons/md'
import { useStore } from '../../contexts/store'
import { useTab } from '../../contexts/tab'
import { Config, Sketch } from 'void'
import { IconButton } from '../ui/icon-button'
import { SidebarPanel } from '../ui/sidebar-panel'

export let LayoutPanel = (props: { sketch: Sketch }) => {
  let [, setConfig] = useStore()
  let [tab] = useTab()
  let { sketch } = props
  let { config } = sketch
  let orientation = Config.orientation(config)
  let [width, height, units] = Config.dimensions(config)
  return (
    <SidebarPanel
      title="Layout"
      summary={
        <span>
          {width} &times; {height} {units}
        </span>
      }
      buttons={
        <>
          <IconButton
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.config.orientation = 'portrait'
              })
            }}
            active={orientation === 'portrait'}
          >
            <MdCrop169 className="transform rotate-90" />
          </IconButton>
          <IconButton
            active={orientation === 'landscape'}
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.config.orientation = 'landscape'
              })
            }}
          >
            <MdCrop169 />
          </IconButton>
          <IconButton
            active={orientation === 'square'}
            onClick={() => {
              setConfig((c) => {
                let t = c.tabs[tab.id]
                t.config.orientation = 'square'
              })
            }}
          >
            <MdCropSquare />
          </IconButton>
        </>
      }
    >
      <DimensionsField sketch={sketch} />
      <MarginsField sketch={sketch} />
    </SidebarPanel>
  )
}
