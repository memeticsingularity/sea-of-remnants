/**
 * 统一 API 请求封装
 *
 * 后端返回统一信封 { code, data, message }。code=0 成功，其余抛 ApiError。
 */

export type ApiEnvelope<T> = {
  code: number
  data: T
  message: string
}

export class ApiError extends Error {
  code: number

  constructor(code: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

export const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)

  let body: ApiEnvelope<T>
  try {
    body = await res.json()
  } catch {
    throw new ApiError(500, '响应不是合法的 JSON')
  }

  if (body.code !== 0) {
    throw new ApiError(body.code, body.message || '请求失败')
  }
  return body.data
}
