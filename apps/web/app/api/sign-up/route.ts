import { revalidateTag } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { db } from '@workspace/server/db/client'
import { user } from '@workspace/server/db/schema/auth-schema'
import { eq } from 'drizzle-orm'

import { redeemInviteCode } from '@/app/server/db/invites'
import { viewerUserTag } from '@/app/server/db/users'
import {
  auth,
  fetchAccessTokenCache,
  getSessionCache,
  signOutWithServer,
} from '@/lib/auth'
import { findOrCreateRepo } from '@/services/api/users'
import { generateInviteCode } from '@/utils/invite'
import { safeNext, signUpPath } from '@/utils/navigation'
import { isRequestError } from '@/utils/toolkit'
import { isUserActive } from '@/utils/user'

export async function GET(request: NextRequest) {
  const nextPath = safeNext(request.nextUrl.searchParams.get('next_path'))
  const repoName = request.nextUrl.searchParams.get('repo')?.trim()
  const inviteCode = request.nextUrl.searchParams.get('invite_code')?.trim()

  // verify
  const session = await getSessionCache()
  if (!session) redirect('/') // 登入過期或失敗
  if (isUserActive(session)) redirect(nextPath) // 帳戶已經註冊

  const handleAbortSignUp = (msg: string) => abortSignUp(
    session.user.id,
    signUpPath({
      next: nextPath,
      error: msg,
      aff: inviteCode,
    }),
  )

  // 表單尚未填寫
  if (!repoName) return handleAbortSignUp('invalid_name')
  if (!inviteCode) return handleAbortSignUp('invalid_invite')

  // token
  const token = await fetchAccessTokenCache()
  if (!token) return handleAbortSignUp('no_permission')

  // create repo
  let fullName: string
  let username: string

  try {
    const repo = await findOrCreateRepo(token, repoName)
    fullName = repo.full_name
    username = `@${repo.owner.login}`
  } catch (error) {
    const status = isRequestError(error) ? error.status : 0
    const errorCode = getErrorStatus(status)
    return handleAbortSignUp(errorCode)
  }

  // 核銷 invite code
  const redeemed = await redeemInviteCode(inviteCode, session.user.id)
  if (redeemed.status !== 'valid') {
    return handleAbortSignUp(redeemed.status === 'limit' ? 'invite_limit' : 'invalid_invite')
  }

  // database
  await db
    .update(user)
    .set({
      repoName: fullName,
      username,
      inviteCode: generateInviteCode(),
      invitedBy: redeemed.invitedBy,
    })
    .where(eq(user.id, session.user.id))

  // A cached "not found" for this username would hide the new profile
  revalidateTag(viewerUserTag(username), { expire: 0 })

  // reload session coolie cache
  await auth.api.getSession({
    headers: await headers(),
    query: { disableCookieCache: true },
  })

  // 回到使用者登入位置
  redirect(nextPath)
}

function getErrorStatus(status: number) {
  if (status === 422) return 'invalid_name'
  if (status === 403 || status === 404) return 'no_permission'
  return 'repo_failed'
}

async function abortSignUp(userId: string, redirectPath: string): Promise<never> {
  await signOutWithServer()
  await db.delete(user).where(eq(user.id, userId))
  redirect(redirectPath)
}
