import { HttpStatusCode } from '@/configs/constants'
import { api } from '@/configs/path-config'

export async function fetchApi<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = params ? `${path}?${new URLSearchParams(params)}` : path
  const res = await fetch(url)

  if (res.status === HttpStatusCode.Unauthorized) {
    window.location.assign(api.signOut)
    return new Promise<never>(() => {})
  }
  if (!res.ok) {
    const body: { message?: string } = await res.json().catch(() => ({}))
    throw new Error(body.message ?? '讀取失敗，請再試一次', { cause: res.status })
  }

  return res.json()
}
