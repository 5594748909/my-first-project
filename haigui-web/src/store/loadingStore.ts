type Listener = () => void

let pendingRequestCount = 0
const listeners = new Set<Listener>()
let snapshot = {
  pendingRequestCount: 0,
  isGlobalLoading: false,
}

function emitChange() {
  listeners.forEach((listener) => listener())
}

export function subscribeLoading(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getLoadingSnapshot() {
  return snapshot
}

export function startGlobalLoading() {
  pendingRequestCount += 1
  snapshot = {
    pendingRequestCount,
    isGlobalLoading: pendingRequestCount > 0,
  }
  emitChange()
}

export function endGlobalLoading() {
  pendingRequestCount = Math.max(0, pendingRequestCount - 1)
  snapshot = {
    pendingRequestCount,
    isGlobalLoading: pendingRequestCount > 0,
  }
  emitChange()
}

