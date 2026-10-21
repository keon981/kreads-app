import type { NextRequest } from 'next/server'

import * as z from 'zod'

import { fetchViewerUser } from '@/app/server/db/users'
import { HttpStatusCode } from '@/configs/constants'
import { fetchAccessTokenCache } from '@/lib/auth'
import { fetchUserRepo } from '@/services/user-repo'
import { isRequestError } from '@/utils/toolkit'

import type { UserRepo } from '@/types/user'

import 'server-only'

const RepoNameSchema = z.string('無效的 repoName').regex(/^[\w.-]+\/[\w.-]+$/, '無效的 repoName')

async function isRegisteredRepo(repoName: string): Promise<boolean> {
  const [owner] = repoName.split('/')
  const user = await fetchViewerUser(`@${owner}`)
  return user?.repoName === repoName
}

export async function respondWithUserRepo<T>(
  request: NextRequest,
  fetcher: (userRepo: UserRepo & { error: boolean }) => Promise<T>,
): Promise<Response> {
  const result = RepoNameSchema.safeParse(request.nextUrl.searchParams.get('repoName'))
  if (!result.success) {
    return Response.json({ message: result.error.issues[0].message }, { status: HttpStatusCode.BadRequest })
  }
  if (!await isRegisteredRepo(result.data)) {
    return Response.json({ message: '找不到此使用者' }, { status: HttpStatusCode.NotFound })
  }

  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, result.data, { autoSignOut: false })

  try {
    const data = await fetcher(userRepo)
    return Response.json(data)
  } catch (err) {
    if (!(err instanceof Error)) throw err
    const status = isRequestError(err) ? err.status : err.cause
    if (typeof status !== 'number') throw err
    // A guest's 401 comes from the server read token; forwarding it would sign the visitor out in fetchApi
    const responseStatus = userRepo.error && status === HttpStatusCode.Unauthorized ? HttpStatusCode.InternalServerError : status
    return Response.json({ message: err.message }, { status: responseStatus })
  }
}
