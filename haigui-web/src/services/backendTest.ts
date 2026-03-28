import { http } from './http'

type TestApiResponse = {
  code: number
  msg: string
  data?: {
    ok?: boolean
    service?: string
    [key: string]: unknown
  }
}

export async function testBackend(): Promise<{ ok: boolean; service: string }> {
  const response = await http.get<TestApiResponse>('/api/test', {
    meta: { showGlobalLoading: false },
  })
  const payload = response.data
  const ok = Boolean(payload.data?.ok)
  const service = String(payload.data?.service ?? '')

  if (!ok || !service) {
    throw new Error(payload.msg || '后端返回异常数据')
  }

  return { ok, service }
}

