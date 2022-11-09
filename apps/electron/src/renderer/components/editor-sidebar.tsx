import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitsPanel } from './panels/traits-panel'
import { LayoutPanel } from './panels/layout-panel'
import { LayersPanel } from './panels/layers-panel'

export let EditorSidebar = () => {
  return (
    <div className="text-xs">
      <LayoutPanel />
      {/* <div className="border-t border-gray-200" /> */}
      <SeedPanel />
      {/* <div className="border-t border-gray-200" /> */}
      <TraitsPanel />
      {/* <div className="border-t border-gray-200" /> */}
      <LayersPanel />
      {/* <div className="border-t border-gray-200" /> */}
      <ExportPanel />
    </div>
  )
}
