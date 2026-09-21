import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { getSessionCache, signUpPath } from '@/lib/auth'
import { findOrCreateRepo, getGitHubToken, isRequestError } from '@/lib/github'
import { safeNext } from '@/utils/navigation'

export async function GET(request: NextRequest) {
  const nextPath = safeNext(request.nextUrl.searchParams.get('next'))
  const repoName = request.nextUrl.searchParams.get('repo')?.trim()

  // verify
  const session = await getSessionCache()
  if (!session || session.user.repoName) redirect('/')
  if (!repoName) redirect('/sign-up')

  // token
  const token = await getGitHubToken()
  if (!token) redirect('/')

  // create repo
  let fullName: string

  try {
    const repo = await findOrCreateRepo(token, repoName)
    fullName = repo.full_name
  } catch (error) {
    const status = isRequestError(error) ? error.status : 0
    const code = getErrorStatus(status)
    redirect(signUpPath(nextPath, code))
  }

  // database
  await db
    .update(user)
    .set({ repoName: fullName })
    .where(eq(user.id, session.user.id))

  redirect(nextPath)
}

function getErrorStatus(status: number) {
  if (status === 422) return 'invalid_name'
  if (status === 403 || status === 404) return 'no_permission'
  return 'repo_failed'
}
