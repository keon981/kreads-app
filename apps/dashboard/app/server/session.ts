import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { cache } from 'react'

import { hasRole } from '@workspace/server/auth/access'

import { dashboardRoles } from '@/configs/auth-config'
import { getSignInPath } from '@/configs/path-config'
import { auth } from '@/lib/auth'

import type { AuthSession } from '@workspace/server/auth/options'
import type { Audience } from '@/types/user'

import 'server-only'

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const requestHeaders = await headers()
  const session = await auth.api.getSession({ headers: requestHeaders })
  if (!session || !dashboardRoles.some(role => hasRole(session.user.role, role))) return null

  return session
})

export function getAudience(session: AuthSession | null): Audience {
  if (!session) return 'guest'

  return hasRole(session.user.role, 'admin') ? 'admin' : 'viewer'
}

export async function verifySession(redirectTo: string): Promise<AuthSession> {
  const session = await getSession()
  if (!session) redirect(getSignInPath(redirectTo))

  return session
}

// Server Actions are public POST endpoints, so every write checks the role here instead of trusting the UI
export async function verifyAdmin(): Promise<AuthSession> {
  const session = await getSession()
  if (!session || !hasRole(session.user.role, 'admin')) throw new Error('Forbidden')

  return session
}
