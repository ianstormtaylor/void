import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitsPanel } from './panels/traits-panel'
import { LayoutPanel } from './panels/layout-panel'
import { Sketch } from 'void'
import { LayersPanel } from './panels/layers-panel'

export let EditorSidebar = (props: { sketch: Sketch | null }) => {
  let { sketch } = props
  return (
    <div className="text-xs">
      {sketch && (
        <>
          <LayoutPanel sketch={sketch} />
          <div className="border-t border-gray-200" />
          <SeedPanel sketch={sketch} />
          <div className="border-t border-gray-200" />
          <TraitsPanel sketch={sketch} />
          <div className="border-t border-gray-200" />
          <LayersPanel sketch={sketch} />
          <div className="border-t border-gray-200" />
          <ExportPanel sketch={sketch} />
        </>
      )}
    </div>
  )
}
