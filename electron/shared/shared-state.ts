import produce, { applyPatches, Patch, enablePatches } from 'immer'
import { IpcRenderer, IpcMainInvokeEvent, IpcRendererEvent } from 'electron'
import { IS_MAIN, IS_RENDERER } from './env'

enablePatches()

let CHANGE_CHANNEL = '__SHARED_STATE_CHANGE__'
let CONNECT_CHANNEL = '__SHARED_STATE_CONNECT__'

export function createSharedStore<T>(state: T) {
  let innerState = state
  let connections = new Set<number>()
  let listeners: Array<(state: T, patches: Patch[]) => void> = []
  let latestPatches: Patch[] = []
  let latestSenderId: number | null = null
  let isUpdating = false
  bind()

  // Bind to IPC channels.
  async function bind() {
    let electron = await import('electron')
    let ipc = IS_MAIN ? electron.ipcMain : electron.ipcRenderer

    // On connect, main processes should store the connection and then send the
    // renderer the current state. Renderers should just store the initial state.
    ipc.on(
      CONNECT_CHANNEL,
      (event: IpcMainInvokeEvent | IpcRendererEvent, state?: T) => {
        if (IS_MAIN) {
          let id = (event as IpcMainInvokeEvent).sender.id
          send(id, CONNECT_CHANNEL, innerState)
          connections.add(id)
        } else {
          innerState = state!
          emit()
        }
      }
    )

    // On change, main processes broadcast to all renderers. Renderers just send
    // the broadcast to the main channel.
    ipc.on(
      CHANGE_CHANNEL,
      (event: IpcMainInvokeEvent | IpcRendererEvent, patches: Patch[]) => {
        if (patches.length === 0) return
        isUpdating = true
        let nextState = applyPatches(innerState, patches)
        let senderId = IS_MAIN ? (event as IpcMainInvokeEvent).sender.id : -1
        latestPatches = patches
        latestSenderId = senderId
        broadcast()
        innerState = nextState
        isUpdating = false
        emit()
      }
    )

    if (IS_RENDERER) {
      ;(ipc as IpcRenderer).send(CONNECT_CHANNEL)
    }
  }

  // Broadcast any changes to all processes.
  async function broadcast() {
    if (latestPatches.length === 0) {
      return
    }

    if (IS_MAIN) {
      for (let id of connections) {
        if (id === latestSenderId) continue
        send(id, CHANGE_CHANNEL, latestPatches)
      }
    }

    if (IS_RENDERER && latestSenderId !== -1) {
      let electron = await import('electron')
      let ipc = IS_MAIN ? electron.ipcMain : electron.ipcRenderer
      ;(ipc as IpcRenderer).send(CHANGE_CHANNEL, latestPatches)
    }
  }

  // Send a message from the main channel to a renderer by `id`.
  async function send(id: number, channel: string, ...args: any[]) {
    let { webContents } = await import('electron')
    let w = webContents.fromId(id)
    if (w) w.send(channel, ...args)
  }

  // Emit the new state to all listeners.
  function emit() {
    for (let listener of listeners) listener(innerState, latestPatches)
  }

  // Set the current state using an immer-based recipe.
  function setState(recipe: (draft: T) => void) {
    isUpdating = true
    innerState = produce(innerState, recipe, (patches) => {
      latestPatches = patches
    })
    broadcast()
    isUpdating = false
    emit()
  }

  // Get the current state.
  function getState(): T {
    if (isUpdating) {
      throw new Error(
        'You may not call store.getState() inside setState method. It has already received the state as an argument. '
      )
    }

    return innerState
  }

  // Subscribe to future state changes.
  function subscribe(listener: (state: T, patches: Patch[]) => void) {
    if (isUpdating) {
      throw new Error(
        'You may not call store.subscribe() inside store.setState(). '
      )
    }

    listeners.push(listener)
    listener(innerState, [])

    return function unsubscribe() {
      if (isUpdating) {
        throw new Error(
          'You may not call unsubscribe() from a store listener while the state is updating. '
        )
      }

      let index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }

  return { setState, getState, subscribe }
}
