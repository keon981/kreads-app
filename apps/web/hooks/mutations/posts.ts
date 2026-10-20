import { mutationOptions } from '@tanstack/react-query'
import type { QueryClient } from '@tanstack/react-query'

import { createPostAction, deletePostAction, updatePostAction } from '@/app/server/actions/post'
import { commentQueries } from '@/hooks/queries/comments'
import { postQueries } from '@/hooks/queries/posts'
import { getActionData, throwIfActionFailed } from '@/utils/toolkit'

import type { Issue, IssueSubmission } from '@/types/issue'

export function setPostList(
  client: QueryClient,
  repoName: string,
  update: (posts: Issue[], pageIndex: number) => Issue[],
): void {
  client.setQueryData(postQueries.list(repoName).queryKey, (currentData) => {
    if (!currentData) return currentData

    return {
      ...currentData,
      pages: currentData.pages.map((page, pageIndex) =>
        (page ? { ...page, posts: update(page.posts, pageIndex) } : page)),
    }
  })
}

export function setPostListItem(
  client: QueryClient,
  repoName: string,
  issueNumber: number,
  update: (post: Issue) => Issue,
): void {
  setPostList(client, repoName, posts =>
    posts.map(post => (post.number === issueNumber ? update(post) : post)))
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
      // 回傳原值（undefined）才不會建立 query；回傳 null 會讓 detail 頁誤判為 404
      if (!currentPost) return currentPost
      return update(currentPost)
    },
  )
}

export function invalidatePost(client: QueryClient, repoName: string, issueNumber: number): void {
  client.invalidateQueries({ queryKey: postQueries.list(repoName).queryKey, refetchType: 'none' })
  client.invalidateQueries({ queryKey: postQueries.detail(repoName, issueNumber).queryKey, refetchType: 'none' })
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
        setPostList(client, repoName, (posts, pageIndex) =>
          (pageIndex === 0 ? [createdPost, ...posts] : posts))

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

        // 標記 list 與 detail 過期，下次掛載時與 server 同步
        invalidatePost(client, repoName, issueNumber)
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
        setPostList(client, repoName, posts =>
          posts.filter(post => post.number !== issueNumber))

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
