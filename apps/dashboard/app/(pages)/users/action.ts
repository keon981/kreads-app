'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { APIError } from 'better-auth/api'

import { isManagedUser } from '@/app/server/db/users'
import { verifyAdmin } from '@/app/server/session'
import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

import type { ActionState } from '@workspace/server/types/action'
import type { UserActionType } from './types'

async function switchActionType(type: UserActionType, userId: string): Promise<unknown> {
  const request = { body: { userId }, headers: await headers() }
  switch (type) {
    case 'ban':
      return auth.api.banUser(request)
    case 'unban':
      return auth.api.unbanUser(request)
    case 'revoke':
      return auth.api.revokeUserSessions(request)
    case 'remove':
      return auth.api.removeUser(request)
  }
}

export async function updateUserAction(type: UserActionType, userId: string): Promise<ActionState> {
  await verifyAdmin()
  if (!await isManagedUser(userId)) return { message: '找不到此使用者' }

  try {
    await switchActionType(type, userId)
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.message }
  }

  revalidatePath(paths.users)
  return {}
}
