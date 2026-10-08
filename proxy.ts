import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

import { GITHUB_TOKEN_HEADER } from '@/configs/constants'
import { privatePaths } from '@/configs/path-config'
import { auth } from '@/lib/auth'
import { decodeAccountCookie, isTokenFresh } from '@/lib/cookie'
import { signInPath } from '@/utils/navigation'

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete(GITHUB_TOKEN_HEADER)

  if (!getSessionCookie(request)) {
    // Optimistic cookie-only check; pages under (private) still verify the session themselves.
    const { pathname, search } = request.nextUrl
    if (privatePaths.includes(pathname)) {
      return NextResponse.redirect(new URL(signInPath(pathname + search), request.url))
    }
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  return attachGitHubToken(request, requestHeaders)
}

async function attachGitHubToken(request: NextRequest, requestHeaders: Headers): Promise<NextResponse> {
  const cookieAccount = await decodeAccountCookie(request.cookies)

  if (cookieAccount?.providerId === 'github' && isTokenFresh(cookieAccount)) {
    requestHeaders.set(GITHUB_TOKEN_HEADER, cookieAccount.accessToken)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }

  try {
    const { headers: authHeaders, response } = await auth.api.getAccessToken({
      body: { useAccountCookie: true },
      headers: request.headers,
      returnHeaders: true,
    })
    const setCookies = authHeaders.getSetCookie()

    requestHeaders.set('cookie', mergeCookieHeader(request.headers.get('cookie') ?? '', setCookies))
    if (response.accessToken) requestHeaders.set(GITHUB_TOKEN_HEADER, response.accessToken)

    const next = NextResponse.next({ request: { headers: requestHeaders } })
    for (const cookie of setCookies) next.headers.append('set-cookie', cookie)
    return next
  } catch (error) {
    console.error('[proxy] getAccessToken failed', error)
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
}

function mergeCookieHeader(cookieHeader: string, setCookies: string[]): string {
  const pairs = new Map(
    cookieHeader.split(/;\s*/).filter(Boolean).map((pair) => {
      const index = pair.indexOf('=')
      return [pair.slice(0, index), pair.slice(index + 1)] as const
    }),
  )

  for (const cookie of setCookies) {
    const [pair = ''] = cookie.split(';')
    const index = pair.indexOf('=')
    const name = pair.slice(0, index).trim()
    const value = pair.slice(index + 1)
    if (value) pairs.set(name, value)
    else pairs.delete(name)
  }

  return [...pairs].map(([name, value]) => `${name}=${value}`).join('; ')
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|.*\\..*).*)'],
}
