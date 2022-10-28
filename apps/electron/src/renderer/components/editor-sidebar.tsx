import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitPanel } from './panels/trait-panel'
import { LayoutPanel } from './panels/layout-panel'
import { Sketch } from 'void'

export let EditorSidebar = (props: { sketch: Sketch | null }) => {
  let { sketch } = props
  let state = sketch?.state
  return (
    <div className="text-xs">
      {sketch && state && state.schema && state.settings && state.config && (
        <>
          <LayoutPanel config={state.config} />
          <div className="border-t border-gray-200" />
          <SeedPanel settings={state.settings} />
          <div className="border-t border-gray-200" />
          <TraitPanel schema={state.schema} traits={state.traits} />
          <div className="border-t border-gray-200" />
          <ExportPanel sketch={sketch} />
        </>
      )}
    </div>
  )
}
