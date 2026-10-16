import { mutationOptions } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { createCommentAction, deleteCommentAction, updateCommentAction } from '@/app/server/actions/comments'
import { invalidatePost, setPostDetail, setPostListItem } from '@/hooks/mutations/posts'
import { commentQueries } from '@/hooks/queries/comments'
import { getActionData, throwIfActionFailed } from '@/utils/toolkit'

import type { IssueComment, IssueSubmission } from '@/types/issue'

export function setCommentList(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
  update: (comments: IssueComment[]) => IssueComment[],
): void {
  const queryKey = commentQueries.list(repoName, issueNumber).queryKey
  client.setQueryData(queryKey, (currentComments) => {
    if (!currentComments) return currentComments
    return update(currentComments)
  })
  client.invalidateQueries({ queryKey, refetchType: 'none' })
}

export const setCommentsData = setCommentList

export const commentMutations = {
  create: (repoName: string, issueNumber: number) =>
    mutationOptions({
      mutationKey: ['comment', 'create', repoName, issueNumber],
      mutationFn: async (submission: IssueSubmission) => {
        const body = submission.content.body
        const actionState = await createCommentAction({ repoName, issueNumber, content: body })
        return getActionData(actionState)
      },
      gcTime: Infinity,
      onSuccess: (createdComment, _variables, _context, { client }) => {
        // Append new comment to comment list
        setCommentList(client, repoName, issueNumber, comments => [...comments, createdComment])

        // Increment comment count in post detail and list
        setPostDetail(client, repoName, issueNumber, post => ({
          ...post,
          commentCount: post.commentCount + 1,
        }))
        setPostListItem(client, repoName, issueNumber, post => ({
          ...post,
          commentCount: post.commentCount + 1,
        }))

        // 標記 list 與 detail 過期，下次掛載時與 server 同步
        invalidatePost(client, repoName, issueNumber)
      },
    }),

  update: (repoName: string, issueNumber: number) =>
    mutationOptions({
      mutationKey: ['comment', 'update', repoName, issueNumber],
      mutationFn: async ({ commentId, submission }: { commentId: number, submission: IssueSubmission }) => {
        const body = submission.content.body
        const actionState = await updateCommentAction({ repoName, commentId, content: body })
        return getActionData(actionState)
      },
      gcTime: Infinity,
      onSuccess: (updatedComment, { commentId }, _context, { client }) => {
        const { body, bodyHTML } = updatedComment

        // Update comment in comment list
        setCommentList(client, repoName, issueNumber, comments =>
          comments.map((comment) => {
            if (comment.id !== commentId) return comment
            return { ...comment, body, bodyHTML }
          }))
      },
    }),

  delete: (repoName: string, issueNumber: number) =>
    mutationOptions({
      mutationKey: ['comment', 'delete', repoName, issueNumber],
      mutationFn: async (commentId: number) => {
        const actionState = await deleteCommentAction({ repoName, commentId })
        throwIfActionFailed(actionState)
        return actionState
      },
      onSuccess: (_actionState, commentId, _context, { client }) => {
        // Filter out deleted comment
        setCommentList(client, repoName, issueNumber, comments =>
          comments.filter(comment => comment.id !== commentId))

        // Decrement comment count in post detail and list
        setPostDetail(client, repoName, issueNumber, post => ({
          ...post,
          commentCount: post.commentCount - 1,
        }))
        setPostListItem(client, repoName, issueNumber, post => ({
          ...post,
          commentCount: post.commentCount - 1,
        }))

        // 標記 list 與 detail 過期，下次掛載時與 server 同步
        invalidatePost(client, repoName, issueNumber)
      },
    }),
}
