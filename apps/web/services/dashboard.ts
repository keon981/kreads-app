import type { RevalidateRequest } from '@workspace/server/types/revalidate'

interface DashboardRevalidationOptions {
  url: URL
  secret: string
  body: RevalidateRequest
}

export async function requestRevalidate({ url, secret, body }: DashboardRevalidationOptions): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${secret}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(5000),
  })

  if (!res.ok) throw new Error(`Dashboard revalidation responded with ${res.status}`)
}
