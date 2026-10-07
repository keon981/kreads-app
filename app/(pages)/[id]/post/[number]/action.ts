'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { fetchAccessTokenCache } from '@/app/server/db/accounts'
import { createIssueComment, deleteIssueComment, updateIssueComment } from '@/services/api/comments'
import { catchParseWithUserRepoError, parseWithUserRepo } from '@/services/user-repo'
import { getFormDataValue } from '@/utils/toolkit'

import type { ActionState, IssueFormState, IssueTarget } from '@/types/action'

const ContentSchema = z.string().trim().min(1, '請輸入內容')

const IdSchema = z.coerce.number().int().positive()

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

export async function createCommentAction(
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, CreateCommentSchema, {
      repoName: getFormDataValue(formData, 'repoName'),
      issueNumber: getFormDataValue(formData, 'issueNumber'),
      content,
    })
    await createIssueComment(userRepo, data.issueNumber, data.content)
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '留言失敗，請再試一次'), content }
  }
}

export async function updateCommentAction(
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, UpdateCommentSchema, {
      repoName: getFormDataValue(formData, 'repoName'),
      commentId: getFormDataValue(formData, 'commentId'),
      content,
    })
    await updateIssueComment(userRepo, data.commentId, data.content)
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '編輯失敗，請再試一次'), content }
  }
}

export async function deleteCommentAction(target: IssueTarget): Promise<ActionState> {
  try {
    const token = await fetchAccessTokenCache()
    const { data, userRepo } = parseWithUserRepo(token, DeleteCommentSchema, target)
    const status = await deleteIssueComment(userRepo, data.commentId)
    refresh()
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}
