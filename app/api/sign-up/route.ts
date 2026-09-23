import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { and, eq, isNull } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { inviteCode as inviteCodeSchema } from '@/db/schema/invite-schema'
import { auth, getSessionCache, signOutWithServer } from '@/lib/auth'
import { fetchGitHubToken, findOrCreateRepo, isRequestError } from '@/lib/github'
import { safeNext, signUpPath } from '@/utils/navigation'
import { isUserActive } from '@/utils/user'

export async function GET(request: NextRequest) {
  const nextPath = safeNext(request.nextUrl.searchParams.get('next_path'))
  const repoName = request.nextUrl.searchParams.get('repo')?.trim()
  const inviteCode = request.nextUrl.searchParams.get('invite_code')?.trim()

  // verify
  const session = await getSessionCache()
  if (!session) redirect('/') // 登入過期或失敗
  if (isUserActive(session)) redirect(nextPath) // 帳戶已經註冊

  const handleAbortSignUp = (m: string) => abortSignUp(session.user.id, nextPath, m)
  // 表單尚未填寫
  if (!repoName) return handleAbortSignUp('invalid_name')
  if (!inviteCode) return handleAbortSignUp('invalid_invite')

  // token
  const token = await fetchGitHubToken()
  if (!token) return handleAbortSignUp('no_permission')

  // create repo
  let fullName: string

  try {
    const repo = await findOrCreateRepo(token, repoName)
    fullName = repo.full_name
  } catch (error) {
    const status = isRequestError(error) ? error.status : 0
    const errorCode = getErrorStatus(status)
    return handleAbortSignUp(errorCode)
  }

  // 核銷 invite code
  const redeemed = await db
    .update(inviteCodeSchema)
    .set({ redeemedBy: session.user.id, redeemedAt: new Date() })
    .where(and(eq(inviteCodeSchema.code, inviteCode), isNull(inviteCodeSchema.redeemedAt)))
    .returning({ id: inviteCodeSchema.id })
  if (redeemed.length === 0) return handleAbortSignUp('invalid_invite')

  // database
  await db
    .update(user)
    .set({ repoName: fullName })
    .where(eq(user.id, session.user.id))

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

async function abortSignUp(
  userId: string,
  nextPath: string,
  message: string,
) {
  await signOutWithServer()
  await db.delete(user).where(eq(user.id, userId))
  redirect(signUpPath(nextPath, message))
}
