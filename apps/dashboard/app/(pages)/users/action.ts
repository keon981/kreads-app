'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { APIError } from 'better-auth/api'
import * as z from 'zod'

import { isManagedUser } from '@/app/server/db/users'
import { verifyAdmin } from '@/app/server/session'
import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'
import { UserActionTypeSchema } from '@/types/user'

import type { ActionState } from '@workspace/server/types/action'
import type { UserActionType } from '@/types/user'

const UpdateUserSchema = z.object({
  type: UserActionTypeSchema,
  userId: z.string().min(1),
})

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

  const parsedInput = UpdateUserSchema.safeParse({ type, userId })
  if (!parsedInput.success) return { message: '無效的操作' }

  const isManaged = await isManagedUser(parsedInput.data.userId)
  if (!isManaged) return { message: '找不到此使用者' }

  try {
    await switchActionType(parsedInput.data.type, parsedInput.data.userId)
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.message }
  }

  revalidatePath(paths.users)
  return {}
}
