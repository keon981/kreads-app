import { SECONDS } from '@workspace/ui/configs/constants'
import { symmetricDecodeJWT } from 'better-auth/crypto'

import { auth } from './auth'

interface CookieReader {
  get: (name: string) => { value: string } | undefined
  getAll: () => { name: string, value: string }[]
}

export interface AccountCookie {
  readonly id: string
  readonly userId: string
  readonly providerId: string
  readonly accessToken?: string | null
  readonly accessTokenExpiresAt?: string | Date | null
}

function getChunkedCookie(cookies: CookieReader, name: string): string | null {
  const whole = cookies.get(name)?.value
  if (whole) return whole

  const prefix = `${name}.`
  const chunks = cookies.getAll()
    .filter(cookie => cookie.name.startsWith(prefix))
    .map(cookie => ({ index: Number(cookie.name.slice(prefix.length)), value: cookie.value }))
    .filter(chunk => Number.isSafeInteger(chunk.index) && chunk.index >= 0)
  if (!chunks.length) return null

  return chunks.sort((a, b) => a.index - b.index).map(chunk => chunk.value).join('')
}

export async function decodeAccountCookie(cookies: CookieReader): Promise<AccountCookie | null> {
  const ctx = await auth.$context
  const value = getChunkedCookie(cookies, ctx.authCookies.accountData.name)
  if (!value) return null

  return symmetricDecodeJWT<AccountCookie>(value, ctx.secretConfig, 'better-auth-account')
}

export function isTokenFresh(account: AccountCookie): account is AccountCookie & { accessToken: string } {
  if (!account.accessToken) return false
  if (!account.accessTokenExpiresAt) return true

  return new Date(account.accessTokenExpiresAt).getTime() - Date.now() > SECONDS.minute * 1000
}
