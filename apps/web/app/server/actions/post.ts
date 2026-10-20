'use server'

import * as z from 'zod'

import { HttpStatusCode } from '@/configs/constants'
import { fetchAccessTokenCache, getSessionCache } from '@/lib/auth'
import { closeIssue, createIssue, updateIssue } from '@/services/github/issues'
import { createIssueReaction, deleteIssueReaction, fetchIssueReactions } from '@/services/github/reactions'
import { catchParseWithUserRepoError, fetchUserRepo, parseWithUserRepo } from '@/services/user-repo'

import type { ActionState } from '@workspace/server/types/action'
import type { ReactionSubject } from '@/services/github/reactions'
import type { IssueActionState, IssueTarget } from '@/types/action'
import type { Issue } from '@/types/issue'

const PostFormSchema = z.object({
  content: z.string().trim().min(1, '請輸入內容'),
})

const UpdatePostSchema = PostFormSchema.extend({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
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

export async function createPostAction(input: { content: string }): Promise<IssueActionState<Issue>> {
  const result = PostFormSchema.safeParse(input)
  if (!result.success) {
    return {
      status: HttpStatusCode.BadRequest,
      message: result.error.issues[0].message,
    }
  }

  const session = await getSessionCache()
  const token = await fetchAccessTokenCache()
  const userRepo = fetchUserRepo(token, session?.user.repoName)
  if (userRepo.error) return { status: HttpStatusCode.Unauthorized, message: '發文失敗，請再試一次' }

  try {
    const issue = await createIssue(userRepo, result.data.content)
    return { status: HttpStatusCode.Created, data: issue }
  } catch (err) {
    return catchParseWithUserRepoError(err, '發文失敗，請再試一次')
  }
}

export async function updatePostAction(input: Required<Pick<IssueTarget, 'repoName' | 'issueNumber'>> & {
  content: string
}): Promise<IssueActionState<Issue>> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, UpdatePostSchema, input)
    const issue = await updateIssue(userRepo, data.issueNumber, data.content)
    return { status: HttpStatusCode.Ok, data: issue }
  } catch (err) {
    return catchParseWithUserRepoError(err, '編輯失敗，請再試一次')
  }
}

export async function deletePostAction(target: IssueTarget): Promise<ActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, DeletePostSchema, target)
    const status = await closeIssue(userRepo, data.issueNumber)
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}

export async function toggleReactionAction(state: ToggleReactionState): Promise<ActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, ReactionSchema, state)
    const { isReacted, viewer } = data
    const subject: ReactionSubject = 'commentId' in data
      ? { commentId: data.commentId }
      : { issueNumber: data.issueNumber }

    if (isReacted) {
      const status = await createIssueReaction(userRepo, subject)
      return { status }
    } else {
      const reactions = await fetchIssueReactions(userRepo, subject)
      const viewerReaction = reactions.find(reaction => `@${reaction.login}` === viewer)
      if (!viewerReaction) return { status: HttpStatusCode.Ok }

      const status = await deleteIssueReaction(
        userRepo,
        subject,
        viewerReaction.id,
      )
      return { status }
    }
  } catch (err) {
    return catchParseWithUserRepoError(err, state.isReacted ? '按讚失敗，請再試一次' : '收回讚失敗，請再試一次')
  }
}
