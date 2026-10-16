import { mutationOptions } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { createPostAction, deletePostAction, updatePostAction } from '@/app/server/actions/posts'
import { commentQueries } from '@/hooks/queries/comments'
import { postQueries } from '@/hooks/queries/posts'
import { getActionData, throwIfActionFailed } from '@/utils/toolkit'

import type { Issue, IssueSubmission } from '@/types/issue'

export function setPostListItem(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
  update: (post: Issue) => Issue,
): void {
  client.setQueryData(
    postQueries.list(repoName).queryKey,
    (currentPosts) => {
      if (!currentPosts) return null
      return currentPosts.map(post => (post.number === issueNumber ? update(post) : post))
    },
  )
}

export function setPostDetail(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
  update: (post: Issue) => Issue,
): void {
  client.setQueryData(
    postQueries.detail(repoName, issueNumber).queryKey,
    (currentPost) => {
      if (!currentPost) return null
      return update(currentPost)
    },
  )
}

export function setPostData(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
  update: (post: Issue) => Issue,
): void {
  setPostListItem(client, repoName, issueNumber, update)
  setPostDetail(client, repoName, issueNumber, update)
  client.invalidateQueries({ queryKey: ['post', repoName], refetchType: 'none' })
}

export const postMutations = {
  create: (repoName: string) =>
    mutationOptions({
      mutationKey: ['post', 'create', repoName],
      mutationFn: async (submission: IssueSubmission) => {
        const body = submission.content.body
        const actionState = await createPostAction({ content: body })
        return getActionData(actionState)
      },
      gcTime: Infinity,
      onSuccess: (createdPost, _variables, _context, { client }) => {
        // Prepend created post to list cache
        client.setQueryData(postQueries.list(repoName).queryKey, (currentPosts) => {
          if (!currentPosts) return null
          return [createdPost, ...currentPosts]
        })

        // Invalidate list query to sync with server
        client.invalidateQueries({
          queryKey: postQueries.list(repoName).queryKey,
          refetchType: 'none',
        })
      },
    }),

  update: (repoName: string) =>
    mutationOptions({
      mutationKey: ['post', 'update', repoName],
      mutationFn: async ({ issueNumber, submission }: { issueNumber: number, submission: IssueSubmission }) => {
        const body = submission.content.body
        const actionState = await updatePostAction({ repoName, issueNumber, content: body })
        return getActionData(actionState)
      },
      gcTime: Infinity,
      onSuccess: (updatedPost, { issueNumber }, _context, { client }) => {
        const { body, bodyHTML, bodyText } = updatedPost

        // Update post in detail cache
        setPostDetail(client, repoName, issueNumber, post => ({
          ...post,
          body,
          bodyHTML,
          bodyText,
        }))

        // Update post in list cache
        setPostListItem(client, repoName, issueNumber, post => ({
          ...post,
          body,
          bodyHTML,
          bodyText,
        }))

        // Invalidate all posts under this repo
        client.invalidateQueries({
          queryKey: ['post', repoName],
          refetchType: 'none',
        })
      },
    }),

  delete: (repoName: string) =>
    mutationOptions({
      mutationKey: ['post', 'delete', repoName],
      mutationFn: async (issueNumber: number) => {
        const actionState = await deletePostAction({ repoName, issueNumber })
        throwIfActionFailed(actionState)
        return actionState
      },
      onSuccess: (_actionState, issueNumber, _context, { client }) => {
        // Remove deleted post from list cache
        client.setQueryData(postQueries.list(repoName).queryKey, (currentPosts) => {
          if (!currentPosts) return null
          return currentPosts.filter(post => post.number !== issueNumber)
        })

        // Invalidate list query
        client.invalidateQueries({
          queryKey: postQueries.list(repoName).queryKey,
          refetchType: 'none',
        })

        // Remove detail and comments cache for the deleted post
        client.removeQueries({
          queryKey: postQueries.detail(repoName, issueNumber).queryKey,
          type: 'inactive',
        })
        client.removeQueries({
          queryKey: commentQueries.list(repoName, issueNumber).queryKey,
          type: 'inactive',
        })
      },
    }),
}
