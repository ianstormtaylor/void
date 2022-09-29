import { SeedPanel } from './panels/seed-panel'
import { ExportPanel } from './panels/export-panel'
import { TraitPanel } from './panels/trait-panel'
import { LayoutPanel } from './panels/layout-panel'

export let EditorSidebar = () => {
  return (
    <div className="text-xs">
      <LayoutPanel />
      <Separator />
      <SeedPanel />
      <Separator />
      <TraitPanel />
      <Separator />
      <ExportPanel />
    </div>
  )
}

let Separator = () => {
  return <div className="border-t border-gray-200" />
}
