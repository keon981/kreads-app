'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { HTTP_STATUS } from '@/constants'
import { getSessionCache } from '@/lib/auth'
import { closeIssue, createIssue } from '@/services/api/issues'
import { createIssueLiked, deleteIssueLiked, fetchIssueLikes } from '@/services/api/reactions'
import { catchParseWithUserRepoError, fetchUserRepo, parseWithUserRepo } from '@/services/user-repo'
import { getFormDataValue } from '@/utils/toolkit'

import type { ActionState, IssueFormState } from '@/types/action'

const IssueNumberSchema = z.int().positive()

const PostFormSchema = z.object({
  content: z.string().trim().min(1, '請輸入內容'),
})

const LikePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  isLiked: z.boolean(),
  viewer: z.string(),
})

type ToggleLikeState = z.infer<typeof LikePostSchema>

interface LikeActionState extends ActionState {
  isLiked?: boolean
}

export async function createPostAction(
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  const result = PostFormSchema.safeParse({ content })
  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      content,
    }
  }

  const session = await getSessionCache()
  const userRepo = await fetchUserRepo(session?.user.repoName)
  if (userRepo.error) return { message: '發文失敗，請再試一次', content }

  try {
    await createIssue(userRepo, result.data.content)
    // TODO: useOptimistic
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '發文失敗，請再試一次'), content }
  }
}

export async function deletePostAction(
  issueNumber: number,
): Promise<ActionState> {
  const result = IssueNumberSchema.safeParse(issueNumber)
  if (!result.success) return { status: HTTP_STATUS.BAD_REQUEST, message: result.error.issues[0].message }

  const session = await getSessionCache()
  const userRepo = await fetchUserRepo(session?.user.repoName)
  if (userRepo.error) return { status: HTTP_STATUS.UNAUTHORIZED, message: '刪除失敗，請再試一次' }

  try {
    const status = await closeIssue(userRepo, result.data)
    // TODO: useOptimistic
    refresh()
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}

export async function toggleLikeAction(state: ToggleLikeState): Promise<LikeActionState> {
  try {
    const { data, userRepo } = await parseWithUserRepo(LikePostSchema, state)
    const { issueNumber, isLiked, viewer } = data

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
    return catchParseWithUserRepoError(err, state.isLiked ? '按讚失敗，請再試一次' : '收回讚失敗，請再試一次')
  }
}
