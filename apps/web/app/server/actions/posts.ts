'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { HttpStatusCode } from '@/configs/constants'
import { fetchAccessTokenCache, getSessionCache } from '@/lib/auth'
import { closeIssue, createIssue, updateIssue } from '@/services/api/issues'
import { createIssueReaction, deleteIssueReaction, fetchIssueReactions } from '@/services/api/reactions'
import { catchParseWithUserRepoError, fetchUserRepo, parseWithUserRepo } from '@/services/user-repo'
import { getFormDataValue } from '@/utils/toolkit'

import type { ReactionSubject } from '@/services/api/reactions'
import type { ActionState, IssueFormState, IssueTarget } from '@/types/action'

const PostFormSchema = z.object({
  content: z.string().trim().min(1, '請輸入內容'),
})

const UpdatePostSchema = PostFormSchema.extend({
  repoName: z.string().min(1),
  issueNumber: z.coerce.number().int().positive(),
})

const DeletePostSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
})

const ReactionBaseSchema = z.object({
  repoName: z.string().min(1),
  isReacted: z.boolean(),
  viewer: z.string(),
})

const ReactionSchema = z.union([
  ReactionBaseSchema.extend({ commentId: z.int().positive() }),
  ReactionBaseSchema.extend({ issueNumber: z.int().positive() }),
])

interface ToggleReactionState extends IssueTarget {
  isReacted: boolean
  viewer: string
}

interface ReactionActionState extends ActionState {
  isReacted?: boolean
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

export async function toggleReactionAction(state: ToggleReactionState): Promise<ReactionActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, ReactionSchema, state)
    const { isReacted, viewer } = data
    const subject: ReactionSubject = 'commentId' in data
      ? { commentId: data.commentId }
      : { issueNumber: data.issueNumber }

    if (isReacted) {
      const status = await createIssueReaction(userRepo, subject)
      return { status, isReacted: true }
    } else {
      const reactions = await fetchIssueReactions(userRepo, subject)
      const viewerReaction = reactions.find(reaction => `@${reaction.login}` === viewer)
      if (!viewerReaction) return { status: HttpStatusCode.Ok, isReacted: false }

      const status = await deleteIssueReaction(
        userRepo,
        subject,
        viewerReaction.id,
      )
      return { status, isReacted: false }
    }
  } catch (err) {
    return catchParseWithUserRepoError(err, state.isReacted ? '按讚失敗，請再試一次' : '收回讚失敗，請再試一次')
  }
}
