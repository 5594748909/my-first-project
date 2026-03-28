import { useEffect, useMemo, useRef, useState, type KeyboardEventHandler } from 'react'
import { Message, type ChatMessage, type MessageVariant } from './Message'
import { askAI, type Story } from '../services'
import { toAppError } from '../errors/normalizeError'
import { reportGlobalError } from '../errors/errorStore'
import { AppErrorBase } from '../errors/appErrors'

interface ChatBoxProps {
  story: Story
  onMessagesChange?: (messages: ChatMessage[]) => void
  disabled?: boolean
}

type MessageItem = {
  message: ChatMessage
  variant?: MessageVariant
}

export function ChatBox({ story, onMessagesChange, disabled }: ChatBoxProps) {
  const [items, setItems] = useState<MessageItem[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const listRef = useRef<HTMLDivElement | null>(null)
  const [dots, setDots] = useState(0)

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading && !disabled, [
    input,
    isLoading,
    disabled,
  ])

  const suggestions = useMemo(() => {
    return [
      `从汤面线索推断，凶手是当时的熟人吗？`,
      '死者认识凶手吗？',
      '这件事和时间或地点有关吗？',
    ]
  }, [story])

  const loadingText = useMemo(() => `思考中${'.'.repeat((dots % 3) + 1)}`, [dots])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [items, isLoading, dots])

  useEffect(() => {
    onMessagesChange?.(items.map((it) => it.message))
  }, [items, onMessagesChange])

  useEffect(() => {
    if (!isLoading) return
    const t = window.setInterval(() => setDots((p) => (p + 1) % 10), 220)
    return () => window.clearInterval(t)
  }, [isLoading])

  const sendMessage = async () => {
    const content = input.trim()
    if (!content || isLoading || disabled) return

    setItems((prev) => [...prev, { message: { role: 'user', content } }])
    setInput('')
    setIsLoading(true)

    try {
      const aiReply = await askAI(content, story)
      setItems((prev) => [...prev, { message: { role: 'ai', content: aiReply } }])
    } catch (error) {
      const appError = toAppError(error)

      // Axios 接口错误会在拦截器中已上报；表单/代码/判题错误未必会走拦截器
      if (appError instanceof AppErrorBase && !(error as any).__appErrorReported) {
        reportGlobalError(appError)
      }

      setItems((prev) => [
        ...prev,
        {
          message: { role: 'ai', content: appError.message },
          variant: 'error',
        },
      ])
    } finally {
      setIsLoading(false)
      setDots(0)
    }
  }

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    sendMessage()
  }

  return (
    <section className="flex h-[58dvh] min-h-[22rem] max-h-[44rem] flex-col rounded-xl border border-slate-700 bg-slate-900/70 md:h-[60dvh]">
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-3 sm:p-4 [overscroll-behavior:contain]">
        {items.length === 0 && !isLoading ? (
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-4">
            <p className="text-sm font-medium text-slate-200">暂无消息</p>
            <p className="mt-1 text-sm leading-6 text-slate-400">
              先从汤面里找“可追问的线索”。提问请尽量明确，用“是/否/无关”逐步逼近真相。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setInput(s)}
                  className="max-w-full rounded-full border border-slate-700 bg-slate-800/40 px-3 py-1 text-xs text-slate-200 transition hover:bg-slate-800 active:scale-[0.98]"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {items.map((item, index) => (
          <Message key={`${item.message.role}-${index}-${item.message.content}`} message={item.message} variant={item.variant} />
        ))}

        {isLoading ? <Message message={{ role: 'ai', content: loadingText }} /> : null}
      </div>

      <div className="border-t border-slate-700 p-3">
        {disabled ? <p className="mb-2 text-xs text-slate-400">游戏已结束，无法继续提问。</p> : null}

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入你的问题，例如：死者认识凶手吗？"
            disabled={isLoading || disabled}
            className="h-11 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 text-sm text-slate-100 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!canSend}
            className="min-h-11 rounded-lg bg-teal-500 px-4 text-sm font-medium text-slate-950 transition hover:bg-teal-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            发送
          </button>
        </div>
      </div>
    </section>
  )
}
