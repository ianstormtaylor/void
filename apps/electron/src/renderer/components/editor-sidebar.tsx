import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitPanel } from './panels/trait-panel'
import { LayoutPanel } from './panels/layout-panel'
import { Sketch } from 'void'
import { LayersPanel } from './panels/layers-panel'

export let EditorSidebar = (props: { sketch: Sketch | null }) => {
  let { sketch } = props
  return (
    <div className="text-xs">
      {sketch && sketch.config && (
        <>
          <LayoutPanel config={sketch.config} />
          <div className="border-t border-gray-200" />
          <SeedPanel settings={sketch.settings} />
          <div className="border-t border-gray-200" />
          <TraitPanel schema={sketch.schema} traits={sketch.traits} />
          <div className="border-t border-gray-200" />
          <LayersPanel sketch={sketch} />
          <div className="border-t border-gray-200" />
          <ExportPanel sketch={sketch} />
        </>
      )}
    </div>
  )
}
