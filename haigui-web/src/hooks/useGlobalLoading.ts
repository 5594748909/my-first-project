import { useSyncExternalStore } from 'react'
import { getLoadingSnapshot, subscribeLoading } from '../store/loadingStore'

export function useGlobalLoading() {
  return useSyncExternalStore(subscribeLoading, getLoadingSnapshot, getLoadingSnapshot)
}

