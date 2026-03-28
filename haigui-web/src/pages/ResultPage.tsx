import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { stories } from '../constants'
import { Message, type ChatMessage } from '../components/Message'

type ResultLocationState = {
  messages?: ChatMessage[]
  gameStatus?: 'revealed' | 'ended' | 'abandoned'
}

export function ResultPage() {
  const { id } = useParams()
  const location = useLocation()
  const state = location.state as ResultLocationState | null

  const story = useMemo(() => stories.find((item) => item.id === id), [id])
  const [revealed, setRevealed] = useState(false)
  const gameStatus = state?.gameStatus

  useEffect(() => {
    const t = window.setTimeout(() => setRevealed(true), 80)
    return () => window.clearTimeout(t)
  }, [])

  const playerMessages = useMemo(() => {
    const messages = state?.messages ?? []
    return messages.filter((m) => m.role === 'user')
  }, [state])

  if (!story) {
    return (
      <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-semibold text-slate-100">结算不存在</h1>
        <p className="text-slate-300">可能是链接参数有误或故事已下线。</p>
        <Link to="/" className="inline-flex rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-600">
          返回大厅
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-4 sm:space-y-5">
      <header className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/35 p-4 shadow-[0_0_30px_rgba(76,29,149,0.22)] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.22em] text-violet-300/80">Result</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-100 sm:text-3xl">{story.title}</h1>
          </div>
          <div className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-sm text-slate-200 shadow-sm">
            {gameStatus === 'abandoned' ? '玩家已放弃' : '汤底揭晓仪式'}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${revealed ? 'bg-teal-300' : 'bg-slate-600'} animate-pulse`} />
            已进入揭晓阶段
          </span>
          <span className="text-slate-500">·</span>
          <span>请克制好奇心，先理解再提问。</span>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">汤底</h2>
        <p
          className={[
            'rounded-xl border border-teal-300/20 bg-teal-400/5 p-5 text-slate-100',
            'transition-all duration-700',
            revealed ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-2 opacity-0 blur-[6px]',
          ].join(' ')}
        >
          <span className="text-xl font-semibold text-teal-200">“{story.bottom}”</span>
        </p>
      </div>

      <div className="rounded-2xl border border-slate-700 bg-slate-900/60 p-4 sm:p-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-300">玩家对话历史（可选）</h2>
        {playerMessages.length > 0 ? (
          <div className="space-y-3">
            {playerMessages.map((m, idx) => (
              <Message key={`${m.content}-${idx}`} message={m} />
            ))}
          </div>
        ) : (
          <p className="text-slate-400">暂无可展示的玩家提问记录。</p>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-end gap-3">
        <Link
          to="/"
          className="min-h-11 rounded-lg bg-teal-500/90 px-5 py-2 text-sm font-medium text-slate-950 transition hover:bg-teal-400 active:scale-[0.98]"
        >
          再来一局
        </Link>
      </footer>
    </section>
  )
}

