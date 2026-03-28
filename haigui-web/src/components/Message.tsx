export type ChatMessage = {
  role: 'user' | 'ai'
  content: string
}

export type MessageVariant = 'default' | 'error'

interface MessageProps {
  message: ChatMessage
  variant?: MessageVariant
  className?: string
}

export function Message({ message, variant = 'default', className }: MessageProps) {
  const isUser = message.role === 'user'
  const isError = !isUser && variant === 'error'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} ${className ?? ''}`}>
      <div
        className={`flex max-w-[85%] items-end gap-2 md:max-w-[70%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm ${
            isUser
              ? 'border-teal-300/40 bg-teal-400/20 text-teal-100'
              : isError
                ? 'border-rose-300/45 bg-rose-400/20 text-rose-100'
                : 'border-violet-300/40 bg-violet-400/20 text-violet-100'
          }`}
          aria-hidden="true"
        >
          {isUser ? '你' : 'AI'}
        </div>

        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-6 shadow-sm ${
            isUser
              ? 'rounded-br-sm bg-teal-500/90 text-slate-950'
              : isError
                ? 'rounded-bl-sm border border-rose-400/20 bg-rose-400/10 text-rose-100'
                : 'rounded-bl-sm border border-slate-700 bg-slate-800 text-slate-100'
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  )
}
