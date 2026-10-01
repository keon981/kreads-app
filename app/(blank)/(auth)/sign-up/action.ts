'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { inviteCode } from '@/db/schema/invite-schema'
import { auth, getSessionCache } from '@/lib/auth'
import { signUpPath } from '@/utils/navigation'
import { getFormDataValue } from '@/utils/toolkit'
import { isUserActive } from '@/utils/user'

import type { ActionState } from '@/types/action'

export async function completeSignUpAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  // return path
  const nextPath = getFormDataValue(formData, 'next_path')

  // verify
  const session = await getSessionCache()
  if (isUserActive(session)) redirect(nextPath)

  // get form values
  const code = getFormDataValue(formData, 'invite_code')
  const repo = getFormDataValue(formData, 'repo_name')
  if (!code) return { message: '請輸入邀請碼' }
  if (!repo) return { message: '請輸入倉庫名稱' }

  // verifyInviteCode
  const message = await verifyInviteCode(code)

  if (message) return message

  // 取得 github 授權
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'github',
      requestSignUp: true,
      scopes: ['public_repo'],
      callbackURL: `/api/sign-up?${new URLSearchParams({ repo, next_path: nextPath, invite_code: code })}`,
      errorCallbackURL: signUpPath(nextPath),
    },
    headers: await headers(),
  })
  if (!url) return { message: '無法取得 GitHub 授權網址，請再試一次' }

  redirect(url)
}

// 查詢邀請碼存在與否或者是否已被使用過
async function verifyInviteCode(code: string) {
  const [invite] = await db
    .select({ id: inviteCode.id })
    .from(inviteCode)
    .where(and(eq(inviteCode.code, code), isNull(inviteCode.redeemedAt)))
    .limit(1)
  if (!invite) return { message: '邀請碼無效或已被使用' }
}
