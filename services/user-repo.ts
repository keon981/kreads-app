import * as z from 'zod'

import { HttpStatusCode, UNAUTHORIZED_MESSAGE } from '@/configs/constants'
import { createOctokit } from '@/lib/octokit'
import { isRequestError } from '@/utils/toolkit'

import type { ActionState } from '@/types/action'
import type { UserRepo } from '@/types/user'

import 'server-only'

export function fetchUserRepo(token: string | null, repoName?: string | null): UserRepo & { error: boolean } {
  const [owner, repo] = repoName?.split('/') ?? ['', '']

  return {
    octokit: createOctokit(token ?? undefined),
    owner,
    repo,
    error: !token,
  }
}

// 驗證 input 並取得使用者 repo，失敗時 throw，交由 catchParseWithUserRepoError 處理
export function parseWithUserRepo<S extends z.ZodType<{ repoName: string }>>(
  token: string | null,
  schema: S,
  input: unknown,
): { data: z.output<S>, userRepo: UserRepo } {
  const result = schema.safeParse(input)
  if (!result.success) throw result.error

  const userRepo = fetchUserRepo(token, result.data.repoName)
  if (userRepo.error) throw new Error(UNAUTHORIZED_MESSAGE)

  return { data: result.data, userRepo }
}

export function catchParseWithUserRepoError(err: unknown, message: string): ActionState {
  switch (true) {
    case err instanceof z.ZodError:
      // schema.safeParse error handlers
      return { status: HttpStatusCode.BadRequest, message: err.issues[0].message }
    case err instanceof Error && err.message === UNAUTHORIZED_MESSAGE:
      // fetchUserRepo 的 401 錯誤
      return { status: HttpStatusCode.Unauthorized, message: err.message }
    case isRequestError(err):
      return { status: err.status, message }
    default:
      throw err
  }
}
