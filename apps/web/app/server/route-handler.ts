import type { NextRequest } from 'next/server'

import * as z from 'zod'

import { HttpStatusCode } from '@/configs/constants'
import { fetchAccessTokenCache } from '@/lib/auth'
import { fetchUserRepo } from '@/services/user-repo'
import { isRequestError } from '@/utils/toolkit'

import type { UserRepo } from '@/types/user'

import 'server-only'

const RepoNameSchema = z.string().regex(/^[\w.-]+\/[\w.-]+$/, '無效的 repoName')

export async function respondWithUserRepo<T>(
  request: NextRequest,
  fetcher: (userRepo: UserRepo & { error: boolean }) => Promise<T>,
): Promise<Response> {
  const result = RepoNameSchema.safeParse(request.nextUrl.searchParams.get('repoName'))
  if (!result.success) {
    return Response.json({ message: result.error.issues[0].message }, { status: HttpStatusCode.BadRequest })
  }

  try {
    const token = await fetchAccessTokenCache()
    const userRepo = fetchUserRepo(token, result.data, { autoSignOut: false })
    const data = await fetcher(userRepo)
    return Response.json(data)
  } catch (err) {
    if (!isRequestError(err)) throw err
    return Response.json({ message: err.message }, { status: err.status })
  }
}
