'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { createIssueComment, deleteIssueComment, updateIssueComment } from '@/services/api/comments'
import { catchParseWithUserRepoError, parseWithUserRepo } from '@/services/user-repo'
import { getFormDataValue } from '@/utils/toolkit'

import type { ActionState, IssueFormState } from '@/types/action'

const ContentSchema = z.string().trim().min(1, '請輸入內容')

const CreateCommentSchema = z.object({
  repoName: z.string().min(1),
  issueNumber: z.int().positive(),
  content: ContentSchema,
})

const UpdateCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: z.int().positive(),
  content: ContentSchema,
})

const DeleteCommentSchema = z.object({
  repoName: z.string().min(1),
  commentId: z.int().positive(),
})

// repoName、issueNumber 由 page 以 bind 帶入
export async function createCommentAction(
  repoName: string,
  issueNumber: number,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  try {
    const { data, userRepo } = await parseWithUserRepo(CreateCommentSchema, { repoName, issueNumber, content })
    await createIssueComment(userRepo, data.issueNumber, data.content)
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '留言失敗，請再試一次'), content }
  }
}

// repoName、commentId 由 page 以 bind 帶入
export async function updateCommentAction(
  repoName: string,
  commentId: number,
  _prev: IssueFormState,
  formData: FormData,
): Promise<IssueFormState> {
  const content = getFormDataValue(formData, 'content')
  try {
    const { data, userRepo } = await parseWithUserRepo(UpdateCommentSchema, { repoName, commentId, content })
    await updateIssueComment(userRepo, data.commentId, data.content)
    refresh()
    return {}
  } catch (err) {
    return { ...catchParseWithUserRepoError(err, '編輯失敗，請再試一次'), content }
  }
}

// repoName、commentId 由 page 以 bind 帶入
export async function deleteCommentAction(
  repoName: string,
  commentId: number,
): Promise<ActionState> {
  try {
    const { data, userRepo } = await parseWithUserRepo(DeleteCommentSchema, { repoName, commentId })
    const status = await deleteIssueComment(userRepo, data.commentId)
    refresh()
    return { status, message: '刪除成功' }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}
