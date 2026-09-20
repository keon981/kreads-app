import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'

import { eq } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { getSessionCache } from '@/lib/auth'
import { findOrCreateRepo, getGitHubToken, isRequestError } from '@/lib/github'

export async function GET(request: NextRequest) {
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
    redirect(`/sign-up?${new URLSearchParams({ error: code })}`)
  }

  //
  await db
    .update(user)
    .set({ repoName: fullName })
    .where(eq(user.id, session.user.id))

  redirect('/')
}

function getErrorStatus(status: number) {
  if (status === 422) return 'invalid_name'
  if (status === 403 || status === 404) return 'no_permission'
  return 'repo_failed'
}
