'use server'

import { createIssueComment, deleteIssueComment, updateIssueComment } from '@/services/api/comments'
import { catchParseWithUserRepoError, parseWithUserRepo } from '@/services/user-repo'
import { HTTP_STATUS } from '@/utils/http-status'

import { CreateCommentSchema, DeleteCommentSchema, UpdateCommentSchema } from './schema'

import type { ActionState } from '@/types/action'
import type { IssueComment } from '@/types/issue'
import type { CreateCommentState, DeleteCommentState, UpdateCommentState } from './schema'

interface CommentActionState extends ActionState {
  comment?: IssueComment
}

export async function createCommentAction(
  state: CreateCommentState,
): Promise<CommentActionState> {
  try {
    const { data, userRepo } = await parseWithUserRepo(CreateCommentSchema, state)
    const comment = await createIssueComment(userRepo, data.issueNumber, data.content)
    return { status: HTTP_STATUS.CREATED, comment }
  } catch (err) {
    return catchParseWithUserRepoError(err, '留言失敗，請再試一次')
  }
}

export async function updateCommentAction(
  state: UpdateCommentState,
): Promise<CommentActionState> {
  try {
    const { data, userRepo } = await parseWithUserRepo(UpdateCommentSchema, state)
    const comment = await updateIssueComment(userRepo, data.commentId, data.content)
    return { status: HTTP_STATUS.OK, comment }
  } catch (err) {
    return catchParseWithUserRepoError(err, '編輯失敗，請再試一次')
  }
}

export async function deleteCommentAction(
  input: DeleteCommentState,
): Promise<ActionState> {
  try {
    const { data, userRepo } = await parseWithUserRepo(DeleteCommentSchema, input)
    const status = await deleteIssueComment(userRepo, data.commentId)
    return { status }
  } catch (err) {
    return catchParseWithUserRepoError(err, '刪除失敗，請再試一次')
  }
}
