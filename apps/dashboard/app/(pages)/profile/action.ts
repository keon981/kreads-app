'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { hasRole } from '@workspace/server/auth/access'
import { APIError } from 'better-auth/api'

import { isEmailTaken } from '@/app/server/db/users'
import { getSession } from '@/app/server/session'
import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

import type { ActionState } from '@workspace/server/types/action'

// The viewer credentials are public, so its form is disabled and the server returns before doing anything
const viewerMessage = { message: '遊客帳號無法修改帳號設定' }

export async function changeEmailAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession()
  if (!session || !hasRole(session.user.role, 'admin')) return viewerMessage

  const newEmail = `${formData.get('email') ?? ''}`.trim().toLowerCase()
  if (!newEmail) return { message: '請輸入新的 Email' }
  if (newEmail === session.user.email) return { message: '新的 Email 與目前相同' }
  // better-auth reports success for a taken email without changing it, so check first
  if (await isEmailTaken(newEmail)) return { message: '此 Email 已被使用' }

  try {
    await auth.api.changeEmail({ body: { newEmail }, headers: await headers() })
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.message }
  }

  revalidatePath('/', 'layout')
  return { isSuccess: true, message: '登入 Email 已更新' }
}

export async function changePasswordAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await getSession()
  if (!session || !hasRole(session.user.role, 'admin')) return viewerMessage

  const currentPassword = `${formData.get('current_password') ?? ''}`
  const newPassword = `${formData.get('new_password') ?? ''}`
  if (!currentPassword || !newPassword) return { message: '請輸入目前密碼與新密碼' }
  if (newPassword !== formData.get('confirm_password')) return { message: '兩次輸入的新密碼不一致' }

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: formData.get('revoke_other_sessions') === 'on' },
      headers: await headers(),
    })
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    const messages: Record<string, string> = {
      INVALID_PASSWORD: '目前密碼錯誤',
      PASSWORD_TOO_SHORT: '新密碼至少要 6 個字元',
      PASSWORD_TOO_LONG: '新密碼太長',
    }
    return { message: messages[error.body?.code ?? ''] ?? error.message }
  }

  revalidatePath(paths.profile)
  return { isSuccess: true, message: '密碼已更新' }
}
