import axios from 'axios'
import {
  AiFormatError,
  ApiError,
  AppErrorBase,
  NetworkError,
  UnknownError,
  ValidationError,
  type ErrorKind,
} from './appErrors'

export function toAppError(error: unknown): AppErrorBase {
  if (error instanceof AppErrorBase) {
    return error
  }

  const anyErr = error as any

  // Axios error
  if (axios.isAxiosError(error)) {
    const status = anyErr?.response?.status as number | undefined
    const data = anyErr?.response?.data as any
    const msg = (data?.msg ?? data?.message ?? anyErr?.message) as unknown as string

    if (status === undefined) {
      return new NetworkError('网络连接失败，请稍后重试。')
    }

    if (status >= 500) {
      return new ApiError('服务暂不可用，请稍后重试。', status)
    }

    if (status === 400) {
      // 400 通常是参数/请求体问题，这类在前端可视为“输入有误/请求异常”
      return new ValidationError('请求数据有误，请稍后重试。', status)
    }

    if (status === 422) {
      // Our backend uses 422 for AI-format errors
      return new AiFormatError('我这次回答不符合判题规范，请换个问法重新提问。')
    }

    return new ApiError(msg || '请求失败，请稍后重试。', status)
  }

  // Generic Error
  if (error instanceof Error) {
    const message = error.message || '系统出错了，请稍后再试。'
    return new UnknownError(message)
  }

  return new UnknownError('系统出错了，请稍后再试。')
}

export function kindToUserCopy(kind: ErrorKind) {
  switch (kind) {
    case 'network':
      return { title: '网络异常' }
    case 'validation':
      return { title: '输入有误' }
    case 'ai_format':
      return { title: '回答不准确' }
    case 'api':
      return { title: '服务异常' }
    case 'code':
    case 'unknown':
    default:
      return { title: '系统异常' }
  }
}

