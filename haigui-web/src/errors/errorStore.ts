import type { AppErrorPayload } from './appErrors'
import { UnknownError } from './appErrors'
import type { AppErrorBase } from './appErrors'

type Listener = () => void

let currentError: AppErrorPayload | null = null
const listeners = new Set<Listener>()

function emitChange() {
  listeners.forEach((l) => l())
}

export function subscribeGlobalError(listener: Listener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getGlobalErrorSnapshot(): AppErrorPayload | null {
  return currentError
}

export function reportGlobalError(error: unknown) {
  if (error instanceof UnknownError) {
    currentError = { kind: error.kind, title: error.title, message: error.message, status: error.status }
  } else if ((error as AppErrorBase | undefined)?.kind) {
    const anyErr = error as AppErrorBase
    currentError = {
      kind: anyErr.kind,
      title: anyErr.title,
      message: anyErr.message,
      status: anyErr.status,
    }
  } else if (error instanceof Error) {
    const err = new UnknownError(error.message)
    currentError = { kind: err.kind, title: err.title, message: err.message, status: err.status }
  } else {
    const err = new UnknownError('系统出错了')
    currentError = { kind: err.kind, title: err.title, message: err.message, status: err.status }
  }
  emitChange()

  // Auto clear after a short time (keeps UI clean)
  window.setTimeout(() => {
    currentError = null
    emitChange()
  }, 4500)
}

