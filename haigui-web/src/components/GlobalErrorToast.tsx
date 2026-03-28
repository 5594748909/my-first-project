import { useEffect } from 'react'
import { useGlobalError } from '../hooks/useGlobalError'
import type { ErrorKind } from '../errors/appErrors'

function kindStyles(kind: ErrorKind) {
  switch (kind) {
    case 'network':
    case 'api':
      return {
        border: 'border-rose-400/30',
        bg: 'bg-rose-500/10',
        text: 'text-rose-100',
      }
    case 'validation':
      return {
        border: 'border-amber-400/30',
        bg: 'bg-amber-400/10',
        text: 'text-amber-100',
      }
    case 'ai_format':
      return {
        border: 'border-violet-400/30',
        bg: 'bg-violet-400/10',
        text: 'text-violet-100',
      }
    case 'code':
    case 'unknown':
    default:
      return {
        border: 'border-rose-400/30',
        bg: 'bg-rose-500/10',
        text: 'text-rose-100',
      }
  }
}

export function GlobalErrorToast() {
  const error = useGlobalError()

  useEffect(() => {
    // prevent stale focus issues when error re-renders quickly
  }, [error])

  if (!error) return null

  const styles = kindStyles(error.kind)

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-50 w-[min(92vw,720px)] -translate-x-1/2">
      <div
        className={[
          'pointer-events-auto rounded-2xl border px-4 py-3 shadow-lg backdrop-blur',
          styles.border,
          styles.bg,
          styles.text,
          'transition duration-150',
        ].join(' ')}
        role="alert"
        aria-live="polite"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold">{error.title}</div>
            <div className="mt-1 text-sm leading-6 opacity-90">{error.message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

