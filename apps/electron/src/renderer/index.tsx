import { createRoot } from 'react-dom/client'
import { useEffect, useState } from 'react'
import { Editor } from './components/editor'
import { HashRouter, Route, Routes, useParams } from 'react-router-dom'
import { useStore } from './contexts/store'
import { Sketch } from 'void'
import { TabContext } from './contexts/tab'
import { EntrypointContext } from './contexts/entrypoint'
import { WindowContext } from './contexts/window'
import { Window } from './components/window'

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
    <div className="w-screen h-screen select-none">
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
  return (
    window && (
      <WindowContext.Provider value={window}>
        <Window />
      </WindowContext.Provider>
    )
  )
}

let TabPage = () => {
  let { id } = useParams()
  let [config] = useStore()
  let [construct, setConstruct] = useState<Sketch['construct'] | null>(null)
  let tab = config.tabs[id!]
  let entrypoint = config.entrypoints[tab?.entrypointId]

  useEffect(() => {
    if (entrypoint.url) {
      import(/* @vite-ignore */ entrypoint.url)
        .then((pkg) => setConstruct(() => pkg.default))
        .catch((e) => console.error(e))
    }
  }, [entrypoint])

  return (
    construct && (
      <TabContext.Provider value={tab}>
        <EntrypointContext.Provider value={entrypoint}>
          <Editor construct={construct} />
        </EntrypointContext.Provider>
      </TabContext.Provider>
    )
  )
}

let root = createRoot(document.getElementById('main')!)
root.render(<App />)
