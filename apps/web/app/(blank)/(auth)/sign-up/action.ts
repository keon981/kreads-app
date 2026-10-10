'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getInviteCodeStatus } from '@/app/server/db/invites'
import { auth, getSessionCache } from '@/lib/auth'
import { signUpPath } from '@/utils/navigation'
import { getFormDataValue } from '@/utils/toolkit'
import { isUserActive } from '@/utils/user'

import type { ActionState } from '@workspace/server/types/action'

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

  const inviteStatus = await getInviteCodeStatus(code)
  if (inviteStatus === 'invalid') return { message: '邀請碼無效或已被使用' }
  if (inviteStatus === 'limit') return { message: '此邀請碼已達到上限' }

  // 取得 github 授權
  const { url } = await auth.api.signInSocial({
    body: {
      provider: 'github',
      requestSignUp: true,
      scopes: ['public_repo'],
      callbackURL: `/api/sign-up?${new URLSearchParams({ repo, next_path: nextPath, invite_code: code })}`,
      errorCallbackURL: signUpPath({ next: nextPath, aff: code }),
    },
    headers: await headers(),
  })
  if (!url) return { message: '無法取得 GitHub 授權網址，請再試一次' }

  redirect(url)
}
