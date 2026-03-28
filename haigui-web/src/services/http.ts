import axios from 'axios'
import { endGlobalLoading, startGlobalLoading } from '../store/loadingStore'
import { reportGlobalError } from '../errors/errorStore'
import { toAppError } from '../errors/normalizeError'

const http = axios.create({
  baseURL: '/',
  timeout: 15000,
})

http.interceptors.request.use((config) => {
  const shouldTrack = config.meta?.showGlobalLoading ?? true
  if (shouldTrack) {
    startGlobalLoading()
  }

  return config
})

http.interceptors.response.use(
  (response) => {
    const shouldTrack = response.config.meta?.showGlobalLoading ?? true
    if (shouldTrack) {
      endGlobalLoading()
    }
    return response
  },
  (error) => {
    const shouldTrack = error?.config?.meta?.showGlobalLoading ?? true
    if (shouldTrack) {
      endGlobalLoading()
    }

    const appError = toAppError(error)
    ;(error as any).__appErrorReported = true
    reportGlobalError(appError)

    return Promise.reject(error)
  },
)

export { http }

