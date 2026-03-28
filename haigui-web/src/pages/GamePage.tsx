import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ChatBox } from '../components/ChatBox'
import type { ChatMessage } from '../components/Message'
import { stories } from '../constants'
import { testBackend } from '../services/backendTest'

export function GamePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [gameStatus, setGameStatus] = useState<'in_progress' | 'revealed' | 'ended' | 'abandoned'>(
    'in_progress',
  )
  const [backendStatus, setBackendStatus] = useState<'unknown' | 'ok' | 'error'>('unknown')

  const story = useMemo(() => stories.find((item) => item.id === id), [id])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await testBackend()
        if (!cancelled) setBackendStatus('ok')
      } catch {
        if (!cancelled) setBackendStatus('error')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  if (!story) {
    return (
      <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-900/60 p-6">
        <h1 className="text-2xl font-semibold text-slate-100">故事不存在</h1>
        <p className="text-slate-300">你访问的故事可能已下线，或链接参数有误。</p>
        <Link to="/" className="inline-flex rounded-lg bg-slate-700 px-4 py-2 text-sm text-slate-100 hover:bg-slate-600">
          返回大厅
        </Link>
      </section>
    )
  }

  return (
    <section className="space-y-3 sm:space-y-4">
      <header className="rounded-xl border border-violet-400/20 bg-gradient-to-br from-slate-900 via-slate-900 to-violet-950/35 p-4 shadow-[0_0_24px_rgba(76,29,149,0.2)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">Current Story</p>
          <div className="flex flex-wrap items-center gap-2">
            {backendStatus === 'ok' ? (
              <span className="rounded-full border border-teal-300/30 bg-teal-400/10 px-3 py-1 text-xs text-teal-200 shadow-sm">
                后端连接正常
              </span>
            ) : null}
            {backendStatus === 'error' ? (
              <span className="rounded-full border border-rose-400/30 bg-rose-400/10 px-3 py-1 text-xs text-rose-100 shadow-sm">
                后端连接失败
              </span>
            ) : null}
            {gameStatus !== 'in_progress' ? (
              <span className="rounded-full border border-slate-700 bg-slate-900/50 px-3 py-1 text-xs text-slate-200 shadow-sm">
                {gameStatus === 'abandoned' ? '已放弃' : '已结束'}
              </span>
            ) : null}
          </div>
        </div>
        <h1 className="text-xl font-semibold text-slate-100 sm:text-2xl md:text-3xl">{story.title}</h1>
        <p className="mt-2 leading-7 text-slate-300 sm:mt-3">{story.surface}</p>
      </header>

      <ChatBox
        story={story}
        onMessagesChange={setChatMessages}
        disabled={gameStatus !== 'in_progress'}
      />

      <footer className="flex flex-wrap items-center justify-end gap-2 rounded-xl border border-slate-700 bg-slate-900/60 p-3 sm:gap-3 sm:p-4">
        <button
          type="button"
          onClick={() => {
            setGameStatus('revealed')
            navigate(`/result/${story.id}`, { state: { messages: chatMessages, gameStatus: 'revealed' } })
          }}
          className="min-h-11 rounded-lg border border-amber-300/40 bg-amber-400/10 px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-amber-400/20 active:scale-[0.98] sm:px-4"
        >
          查看汤底
        </button>
        <button
          type="button"
          onClick={() => {
            setGameStatus('abandoned')
            navigate('/')
          }}
          className="min-h-11 rounded-lg border border-slate-700 bg-slate-900/40 px-3 py-2 text-sm font-medium text-slate-200 transition hover:bg-slate-800 active:scale-[0.98] sm:px-4"
        >
          放弃游戏
        </button>
        <Link
          to="/"
          className="min-h-11 rounded-lg bg-rose-500/90 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-rose-400 active:scale-[0.98] sm:px-4"
        >
          结束游戏
        </Link>
      </footer>
    </section>
  )
}
