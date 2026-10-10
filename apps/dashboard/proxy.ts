import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

import { authCookiePrefix } from '@/configs/auth-config'
import { paths } from '@/configs/path-config'

// Optimistic cookie-only check; pages and Server Actions still verify the session and role themselves
export function proxy(request: NextRequest): NextResponse {
  if (getSessionCookie(request, { cookiePrefix: authCookiePrefix })) return NextResponse.next()

  return NextResponse.redirect(new URL(paths.signIn, request.url))
}

export const config = {
  matcher: ['/((?!api/auth|sign-in|_next/static|_next/image|.*\\..*).*)'],
}
