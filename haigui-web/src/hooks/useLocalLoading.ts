import { useCallback, useState } from 'react'

export function useLocalLoading(initialValue = false) {
  const [isLoading, setIsLoading] = useState(initialValue)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])

  const withLoading = useCallback(async <T,>(task: () => Promise<T>) => {
    setIsLoading(true)
    try {
      return await task()
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  }
}

