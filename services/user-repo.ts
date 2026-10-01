import * as z from 'zod'

import { HTTP_STATUS } from '@/configs/constants'
import { fetchAccessTokenCache } from '@/lib/auth'
import { createOctokit } from '@/lib/octokit'
import { isRequestError } from '@/utils/toolkit'

import type { ActionState } from '@/types/action'
import type { UserRepo } from '@/types/user'

import 'server-only'

const UNAUTHORIZED_MESSAGE = '請先登入'

export async function fetchUserRepo(repoName?: string | null): Promise<UserRepo & { error: boolean }> {
  const token = await fetchAccessTokenCache()

  const [owner, repo] = repoName?.split('/') ?? ['', '']

  return {
    octokit: createOctokit(token ?? undefined),
    owner,
    repo,
    error: !token,
  }
}

// 驗證 input 並取得使用者 repo，失敗時 throw，交由 catchParseWithUserRepoError 處理
export async function parseWithUserRepo<S extends z.ZodType<{ repoName: string }>>(
  schema: S,
  input: unknown,
): Promise<{ data: z.output<S>, userRepo: UserRepo }> {
  const result = schema.safeParse(input)
  if (!result.success) throw result.error

  const userRepo = await fetchUserRepo(result.data.repoName)
  if (userRepo.error) throw new Error(UNAUTHORIZED_MESSAGE)

  return { data: result.data, userRepo }
}

export function catchParseWithUserRepoError(err: unknown, message: string): ActionState {
  switch (true) {
    case err instanceof z.ZodError:
      // schema.safeParse 錯誤處理
      return { status: HTTP_STATUS.BAD_REQUEST, message: err.issues[0].message }
    case err instanceof Error && err.message === UNAUTHORIZED_MESSAGE:
      // fetchUserRepo 的 401 錯誤
      return { status: HTTP_STATUS.UNAUTHORIZED, message: err.message }
    case isRequestError(err):
      return { status: err.status, message }
    default:
      throw err
  }
}
