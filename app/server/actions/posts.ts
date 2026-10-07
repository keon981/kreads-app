'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { fetchAccessTokenCache } from '@/app/server/db/accounts'
import { HTTP_STATUS } from '@/configs/constants'
import { getSessionCache } from '@/lib/auth'
import { closeIssue, createIssue, updateIssue } from '@/services/api/issues'
import { createIssueLiked, deleteIssueLiked, fetchIssueLikes } from '@/services/api/reactions'
import { catchParseWithUserRepoError, fetchUserRepo, parseWithUserRepo } from '@/services/user-repo'
import { getFormDataValue } from '@/utils/toolkit'

import type { ActionState, IssueFormState, IssueTarget } from '@/types/action'

const PostFormSchema = z.object({
  content: z.string().trim().min(1, '請輸入內容'),
})

// repoName、issueNumber 由表單的 hidden input 帶入，issueNumber 是字串，用 coerce 轉型
const UpdatePostSchema = PostFormSchema.extend({
  repoName: z.string().min(1),
  issueNumber: z.coerce.number().int().positive(),
})

const DeletePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
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
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, session?.user.repoName)
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

export async function updatePostAction(
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, UpdatePostSchema, {
      repoName: getFormDataValue(formData, 'repoName'),
      issueNumber: getFormDataValue(formData, 'issueNumber'),
      content,
    })
    await updateIssue(userRepo, data.issueNumber, data.content)
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '編輯失敗，請再試一次'), content }
  }
}

export async function deletePostAction(target: IssueTarget): Promise<ActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, DeletePostSchema, target)
    const status = await closeIssue(userRepo, data.issueNumber)
    // TODO: useOptimistic
    refresh()
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}

export async function toggleLikeAction(state: ToggleLikeState): Promise<LikeActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, LikePostSchema, state)
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
