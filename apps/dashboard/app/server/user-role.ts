import { headers } from 'next/headers'

import { APIError } from 'better-auth/api'

import { isManagedUser } from '@/app/server/db/users'
import { auth } from '@/lib/auth'

import type { ActionState } from '@workspace/server/types/action'
import type { AssignableRole } from '@/types/user'

import 'server-only'

// Callers must run verifyAdmin first; dashboard accounts are never touched because isManagedUser only matches site users
export async function assignUserRole(userId: string, role: AssignableRole): Promise<ActionState> {
  const isManaged = await isManagedUser(userId)
  if (!isManaged) return { message: '找不到此使用者' }

  try {
    const requestHeaders = await headers()
    await auth.api.setRole({ body: { userId, role }, headers: requestHeaders })
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.message }
  }

  return {}
}
