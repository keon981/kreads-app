import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

import { authCookiePrefix } from '@/configs/auth-config'
import { getSignInPath } from '@/configs/path-config'

// Optimistic cookie-only check; the profile page still verifies the session itself
export function proxy(request: NextRequest): NextResponse {
  if (getSessionCookie(request, { cookiePrefix: authCookiePrefix })) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  const url = new URL(getSignInPath(pathname + search), request.url)
  return NextResponse.redirect(url)
}

// Only the profile page needs an account; the rest of the console is public
export const config = {
  matcher: ['/profile/:path*'],
}
