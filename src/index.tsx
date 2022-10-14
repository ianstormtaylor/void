import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Editor } from './components/editor'
import { ModuleContext } from './contexts/module'
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom'
import { useConfig } from './contexts/config'
import { Banner } from './components/banner'
import { Module } from '../void'
import { TabContext } from './contexts/tab'
import { SketchContext } from './contexts/sketch'

let App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/windows/:id" element={<WindowPage />} />
        <Route path="/tabs/:id" element={<TabPage />} />
      </Routes>
    </BrowserRouter>
  )
}

let WindowPage = () => {
  let { id } = useParams()
  let [config] = useConfig()
  let window = config.windows[id!]
  return window && <Banner key={window.id} window={window} />
}

let TabPage = () => {
  let { id } = useParams()
  let [config] = useConfig()
  let [module, setModule] = useState<Module | null>(null)
  let tab = config.tabs[id!]
  let sketch = config.sketches[tab?.sketchId]

  useEffect(() => {
    if (sketch.entrypoint) {
      import(/* @vite-ignore */ sketch.entrypoint)
        .then((pkg) => setModule(pkg))
        .catch((e) => console.error(e))
    }
  }, [sketch])

  return (
    module && (
      <ModuleContext.Provider value={module}>
        <TabContext.Provider value={tab}>
          <SketchContext.Provider value={sketch}>
            <Editor />
          </SketchContext.Provider>
        </TabContext.Provider>
      </ModuleContext.Provider>
    )
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
