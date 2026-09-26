'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { fetchUserRepo } from '@/server/github'
import { closeIssue } from '@/server/issues'
import { createIssueLiked, deleteIssueLiked, fetchIssueLikes } from '@/services/api/reactions'
import { HTTP_STATUS } from '@/types/http-status'
import { isRequestError } from '@/utils/status'

import type { ActionState } from '@/types/action'

export interface LikeActionState extends ActionState {
  isLiked?: boolean
}

const IssueNumberSchema = z.int().positive()

export async function deletePostAction(
  issueNumber: number,
): Promise<ActionState> {
  const result = IssueNumberSchema.safeParse(issueNumber)
  if (!result.success) return { status: 400, message: result.error.message }

  const status = await closeIssue(result.data)
  if (status !== 200) return { status, message: '刪除失敗，請再試一次' }

  // TODO: useOptimistic
  refresh()
  return { status, message: '刪除成功' }
}

const LikePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  isLiked: z.boolean(),
  viewer: z.string(),
})

export type ToggleLikeState = z.infer<typeof LikePostSchema>

export async function toggleLikeAction(state: ToggleLikeState): Promise<LikeActionState> {
  const result = LikePostSchema.safeParse(state)
  if (!result.success) return { status: HTTP_STATUS.BAD_REQUEST, message: result.error.message }

  const { repoName, issueNumber, isLiked, viewer } = result.data

  const userRepo = await fetchUserRepo(repoName)
  if (userRepo.error) return { status: HTTP_STATUS.UNAUTHORIZED, message: '請先登入' }

  try {
    if (isLiked) {
      const status = await createIssueLiked(userRepo, issueNumber)
      return { status, isLiked: true }
    } else {
      const reactions = await fetchIssueLikes(userRepo, issueNumber)
      const viewerReaction = reactions.find(reaction => `@${reaction.login}` === viewer)
      if (!viewerReaction) return { status: HTTP_STATUS.OK, isLiked: false }

      const status = await deleteIssueLiked(
        userRepo,
        issueNumber,
        viewerReaction.id,
      )
      return { status, isLiked: false }
    }
  } catch (err) {
    if (!isRequestError(err)) throw err

    return {
      status: err.status,
      message: isLiked ? '按讚失敗，請再試一次' : '收回讚失敗，請再試一次',
    }
  }
}
