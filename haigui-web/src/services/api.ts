import type { TurtleStory } from '../constants'
import { http } from './http'
import { AiFormatError, ValidationError } from '../errors/appErrors'

export type Story = TurtleStory

type BackendResponse = {
  code?: number
  msg?: string
  data?: {
    result?: string
    error?: boolean
  }
}

const CHAT_API_URL = '/api/chat'

const allowedReplies = new Set(['是', '否', '无关'])

function normalizeReply(raw: string): string | null {
  const cleaned = raw.trim().replace(/[。！!,.，\s]/g, '')
  if (cleaned === '无关紧要') return '无关'
  if (allowedReplies.has(cleaned)) return cleaned
  return null
}

export async function askAI(question: string, story: Story): Promise<string> {
  if (!question.trim()) {
    throw new ValidationError('问题不能为空')
  }

  const response = await http.post<BackendResponse>(
    CHAT_API_URL,
    {
      question: question.trim(),
      story,
    },
    {
      meta: { showGlobalLoading: true },
    },
  )

  const payload = response.data
  const backendResult = payload.data?.result
  const normalized = backendResult ? normalizeReply(backendResult) : null
  if (normalized) return normalized

  throw new AiFormatError('我这次回答不符合判题规范，请换个问法重新提问。')
}
