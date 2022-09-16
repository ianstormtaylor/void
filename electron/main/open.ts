import { app, dialog } from 'electron'
import { Window } from './window'

/** Prompt to open a sketch file or directory. */
export async function open() {
  let result = await dialog.showOpenDialog({
    properties: ['openFile', 'openDirectory'],
  })
  let [path] = result.filePaths
  if (!path) return
  new Window(path)
  app.addRecentDocument(path)
}
