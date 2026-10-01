import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { getSessionCookie } from 'better-auth/cookies'

import { signInPath } from '@/utils/navigation'

// Optimistic cookie-only check; pages under (private) still verify the session themselves.
export function proxy(request: NextRequest): NextResponse {
  if (getSessionCookie(request)) return NextResponse.next()

  const { pathname, search } = request.nextUrl
  return NextResponse.redirect(new URL(signInPath(pathname + search), request.url))
}

// Must be a literal list; keep in sync with the routes under app/(pages)/(private).
export const config = {
  matcher: ['/profile', '/saved'],
}
