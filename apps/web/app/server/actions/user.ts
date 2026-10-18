'use server'

import { headers } from 'next/headers'

import * as z from 'zod'

import { revalidateDashboardCache } from '@/app/server/dashboard'
import { fetchUserVisibility, updateUserVisibility } from '@/app/server/db/users'
import { auth, verifySession } from '@/lib/auth'

import type { ActionState } from '@workspace/server/types/action'

const VisibilitySchema = z.boolean()

export async function updateVisibilityAction(isPublic: boolean): Promise<ActionState> {
  const parsedInput = VisibilitySchema.safeParse(isPublic)
  if (!parsedInput.success) return { message: '無效的設定' }

  const { status, session } = await verifySession()
  if (status !== 'active') return { message: '請先登入' }

  const userId = session.user.id
  const previousIsPublic = await fetchUserVisibility(userId)
  await updateUserVisibility(userId, parsedInput.data)

  // viewer's cached list lasts for days, so keep the change only after the dashboard clears it
  const isRevalidated = await revalidateDashboardCache(['viewer'])
  if (!isRevalidated) {
    await updateUserVisibility(userId, previousIsPublic)
    return { message: '後台同步失敗，請再試一次' }
  }

  // The session cookie caches the user for an hour; read it again so the menu shows the new setting
  const requestHeaders = await headers()
  await auth.api.getSession({ headers: requestHeaders, query: { disableCookieCache: true } })

  return { isSuccess: true }
}
