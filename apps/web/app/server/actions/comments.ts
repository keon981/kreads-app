'use server'

import * as z from 'zod'

import { HttpStatusCode } from '@/configs/constants'
import { fetchAccessTokenCache } from '@/lib/auth'
import { createIssueComment, deleteIssueComment, updateIssueComment } from '@/services/github/comments'
import { catchParseWithUserRepoError, parseWithUserRepo } from '@/services/user-repo'

import type { ActionState } from '@workspace/server/types/action'
import type { IssueActionState, IssueTarget } from '@/types/action'
import type { IssueComment } from '@/types/issue'

const ContentSchema = z.string().trim().min(1, '請輸入內容')

const IdSchema = z.int().positive()

const CreateCommentSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: IdSchema,
  content: ContentSchema,
})

const UpdateCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: IdSchema,
  content: ContentSchema,
})

const DeleteCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: IdSchema,
})

export async function createCommentAction(input: Required<Pick<IssueTarget, 'repoName' | 'issueNumber'>> & {
  content: string
}): Promise<IssueActionState<IssueComment>> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, CreateCommentSchema, input)
    const comment = await createIssueComment(userRepo, data.issueNumber, data.content)
    return { status: HttpStatusCode.Created, data: comment }
  } catch (err) {
    return catchParseWithUserRepoError(err, '留言失敗，請再試一次')
  }
}

export async function updateCommentAction(input: Required<Pick<IssueTarget, 'repoName' | 'commentId'>> & {
  content: string
}): Promise<IssueActionState<IssueComment>> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, UpdateCommentSchema, input)
    const comment = await updateIssueComment(userRepo, data.commentId, data.content)
    return { status: HttpStatusCode.Ok, data: comment }
  } catch (err) {
    return catchParseWithUserRepoError(err, '編輯失敗，請再試一次')
  }
}

export async function deleteCommentAction(target: IssueTarget): Promise<ActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, DeleteCommentSchema, target)
    const status = await deleteIssueComment(userRepo, data.commentId)
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}
