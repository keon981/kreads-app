import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { cache } from 'react'

import { hasRole } from '@workspace/server/auth/access'

import { dashboardRoles } from '@/configs/auth-config'
import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

import type { AuthSession } from '@workspace/server/auth/options'

import 'server-only'

export const getSession = cache(async (): Promise<AuthSession | null> => {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session || !dashboardRoles.some(role => hasRole(session.user.role, role))) return null

  return session
})

// Pages: signed-out visitors go to the sign-in page
export async function verifySession(): Promise<AuthSession> {
  const session = await getSession()
  if (!session) redirect(paths.signIn)

  return session
}

// Server Actions are public POST endpoints, so every write checks the role here instead of trusting the UI
export async function verifyAdmin(): Promise<AuthSession> {
  const session = await getSession()
  if (!session || !hasRole(session.user.role, 'admin')) throw new Error('Forbidden')

  return session
}
