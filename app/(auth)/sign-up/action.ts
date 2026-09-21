'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { inviteCode } from '@/db/schema/invite-schema'
import { auth, getSessionCache, signUpPath } from '@/lib/auth'
import { isUserActive } from '@/utils/user'

import type { AuthSession } from '@/types/auth'

export interface SignUpRes {
  message?: string
}

export async function completeSignUpAction(
  _prevState: SignUpRes,
  formData: FormData,
): Promise<SignUpRes> {
  // return path
  const nextPath = String(formData.get('next_path'))

  // verify
  const session = await getSessionCache()
  if (!session) redirect('/sign-in') // 登入失敗 or 登入過期，跳到登入頁面重新登入或註冊
  if (isUserActive(session)) redirect(nextPath)

  // get form values
  const inviteCode = formData.get('invite_code') as string
  const repoName = formData.get('repo_name') as string
  const repo = repoName.trim()
  if (!inviteCode) return { message: '請輸入邀請碼' }
  if (!repo) return { message: '請輸入倉庫名稱' }

  // verifyInviteCode
  const message = await verifyInviteCode(session, inviteCode)

  if (message) return message

  // 取得 github 授權
  const { url } = await auth.api.linkSocialAccount({
    body: {
      provider: 'github',
      scopes: ['public_repo'],
      callbackURL: `/api/sign-up?${new URLSearchParams({ repo, next: nextPath })}`,
      errorCallbackURL: signUpPath(nextPath),
    },
    headers: await headers(),
  })

  redirect(url)
}

async function verifyInviteCode(session: AuthSession, code: string) {
  const redeemed = await db
    .update(inviteCode)
    .set({ redeemedBy: session.user.id, redeemedAt: new Date() })
    .where(and(eq(inviteCode.code, code), isNull(inviteCode.redeemedAt)))
    .returning({ id: inviteCode.id })
  if (redeemed.length === 0) return { message: '邀請碼無效' }

  await db
    .update(user)
    .set({ status: 'active' })
    .where(eq(user.id, session.user.id))
}
