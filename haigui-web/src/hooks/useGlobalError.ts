import { useSyncExternalStore } from 'react'
import { getGlobalErrorSnapshot, subscribeGlobalError } from '../errors/errorStore'

export function useGlobalError() {
  return useSyncExternalStore(subscribeGlobalError, getGlobalErrorSnapshot, getGlobalErrorSnapshot)
}

