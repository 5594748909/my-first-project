import type { ReactNode } from 'react'
import { Component } from 'react'
import { reportGlobalError } from './errorStore'
import { toAppError } from './normalizeError'

type Props = {
  children: ReactNode
}

type State = {
  hasError: boolean
  message: string
}

export class GlobalErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(error: unknown): State {
    const appError = toAppError(error)
    return { hasError: true, message: appError.message }
  }

  componentDidCatch(error: unknown) {
    const appError = toAppError(error)
    reportGlobalError(appError)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
        <div className="w-full rounded-2xl border border-rose-400/30 bg-rose-500/10 p-6 shadow-lg">
          <div className="text-lg font-semibold text-rose-100">系统异常</div>
          <div className="mt-2 text-sm leading-6 text-rose-100/90">{this.state.message}</div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.assign('/')}
              className="rounded-lg bg-rose-500/90 px-4 py-2 text-sm font-medium text-slate-950 transition hover:bg-rose-400"
            >
              返回大厅
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-lg border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 transition hover:bg-rose-500/15"
            >
              刷新页面
            </button>
          </div>
        </div>
      </div>
    )
  }
}

