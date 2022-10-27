import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Editor } from './components/editor'
import { ModuleContext } from './contexts/module'
import { HashRouter, Route, Routes, useParams } from 'react-router-dom'
import { useStore } from './contexts/store'
import { Banner } from './components/banner'
import { Module } from 'void'
import { TabContext } from './contexts/tab'
import { SketchContext } from './contexts/sketch'

let App = () => {
  let [dragging, setDragging] = useState(false)

  useEffect(() => {
    const onDrop = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
      const files = e.dataTransfer?.files ?? []
      const paths = Array.from(files).map((f) => f.path)
      window.electron.openFiles(paths)
    }
    const onDragOver = (e: DragEvent) => {
      if (e.dataTransfer?.files.length) {
        e.preventDefault()
        setDragging(true)
      }
    }
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      setDragging(false)
    }
    document.body.addEventListener('drop', onDrop)
    document.body.addEventListener('dragover', onDragOver)
    document.body.addEventListener('dragleave', onDragLeave)
    return () => {
      document.body.removeEventListener('drop', onDrop)
      document.body.removeEventListener('dragover', onDragOver)
      document.body.removeEventListener('dragleave', onDragLeave)
    }
  }, [])

  return (
    <div className="w-screen h-screen">
      <HashRouter>
        <Routes>
          <Route path="/windows/:id" element={<WindowPage />} />
          <Route path="/tabs/:id" element={<TabPage />} />
        </Routes>
      </HashRouter>
      {dragging && (
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>
      )}
    </div>
  )
}

let WindowPage = () => {
  let { id } = useParams()
  let [config] = useStore()
  let window = config.windows[id!]
  return window && <Banner key={window.id} window={window} />
}

let TabPage = () => {
  let { id } = useParams()
  let [config] = useStore()
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
