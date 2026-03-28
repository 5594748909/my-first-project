export type ErrorKind = 'network' | 'api' | 'validation' | 'ai_format' | 'code' | 'unknown'

export type AppErrorPayload = {
  kind: ErrorKind
  title: string
  message: string
  status?: number
}

export class AppErrorBase extends Error {
  kind: ErrorKind
  title: string
  status?: number

  constructor(payload: AppErrorPayload) {
    super(payload.message)
    this.name = payload.kind
    this.kind = payload.kind
    this.title = payload.title
    this.status = payload.status
  }
}

export class NetworkError extends AppErrorBase {
  constructor(message = '网络连接失败，请稍后重试。') {
    super({ kind: 'network', title: '网络异常', message })
  }
}

export class ApiError extends AppErrorBase {
  constructor(message = '请求失败，请稍后重试。', status?: number) {
    super({ kind: 'api', title: '服务异常', message, status })
  }
}

export class ValidationError extends AppErrorBase {
  constructor(message = '请检查输入内容后重试。', status?: number) {
    super({ kind: 'validation', title: '输入有误', message, status })
  }
}

export class AiFormatError extends AppErrorBase {
  constructor(message = '我这次回答不符合判题规范，请换个问法重新提问。') {
    super({ kind: 'ai_format', title: '回答不准确', message })
  }
}

export class CodeError extends AppErrorBase {
  constructor(message = '系统出错了，请稍后再试。', status?: number) {
    super({ kind: 'code', title: '系统异常', message, status })
  }
}

export class UnknownError extends AppErrorBase {
  constructor(message = '系统出错了，请稍后再试。', status?: number) {
    super({ kind: 'unknown', title: '系统异常', message, status })
  }
}

