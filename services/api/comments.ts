import { PAGE_SIZE } from '@/configs/constants'

import { ISSUE_COMMENTS_QUERY } from '../graphql/comments'
import { isViewerReacted } from './reactions'

import type { IssueComment } from '@/types/issue'
import type { UserRepo } from '@/types/user'
import type { GraphqlIssueComment, GraphqlIssueCommentsResponse } from '../graphql/comments'

/* === utils === */

function toIssueComment(comment: {
  id: number | bigint
  body?: string
  body_html?: string
  created_at: string
  user: {
    login: string
    avatar_url: string
  } | null
  reactions?: {
    heart: number
  }
}): IssueComment {
  return {
    id: Number(comment.id),
    body: comment.body ?? '',
    bodyHTML: comment.body_html ?? '',
    createdAt: comment.created_at,
    author: comment.user
      ? { login: comment.user.login, avatarUrl: comment.user.avatar_url }
      : null,
    reactionCount: comment.reactions?.heart ?? 0,
    isReacted: false,
  }
}

function toIssueCommentFromGraphql(comment: GraphqlIssueComment): IssueComment {
  return {
    id: Number(comment.fullDatabaseId),
    body: comment.body,
    bodyHTML: comment.bodyHTML,
    createdAt: comment.createdAt,
    author: comment.author,
    reactionCount: comment.reactions.totalCount,
    isReacted: isViewerReacted(comment.reactionGroups),
  }
}

/* === Issue Comments === */

async function fetchIssueCommentsWithRest(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<IssueComment[]> {
  const { data } = await octokit.rest.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber,
    per_page: PAGE_SIZE.comments,
    mediaType: { format: 'full' }, // return body & body_html
  })
  return data.map(toIssueComment)
}

async function fetchIssueCommentsWithGraphql(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<IssueComment[]> {
  const { repository } = await octokit.graphql<GraphqlIssueCommentsResponse>(ISSUE_COMMENTS_QUERY, {
    owner,
    repo,
    number: issueNumber,
    first: PAGE_SIZE.comments,
  })
  return repository.issue.comments.nodes.map(toIssueCommentFromGraphql)
}

async function fetchIssueComments(
  userRepo: UserRepo & { error: boolean },
  issueNumber: number,
): Promise<IssueComment[]> {
  return userRepo.error
    ? fetchIssueCommentsWithRest(userRepo, issueNumber)
    : fetchIssueCommentsWithGraphql(userRepo, issueNumber)
}

async function createIssueComment(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
  body: string,
): Promise<IssueComment> {
  const { data } = await octokit.rest.issues.createComment({
    owner,
    repo,
    issue_number: issueNumber,
    body,
  })
  return toIssueComment(data)
}

async function updateIssueComment(
  { octokit, owner, repo }: UserRepo,
  commentId: number,
  body: string,
): Promise<IssueComment> {
  const { data } = await octokit.rest.issues.updateComment({
    owner,
    repo,
    comment_id: commentId,
    body,
  })
  return toIssueComment(data)
}

async function deleteIssueComment(
  { octokit, owner, repo }: UserRepo,
  commentId: number,
): Promise<number> {
  const { status } = await octokit.rest.issues.deleteComment({
    owner,
    repo,
    comment_id: commentId,
  })
  return status
}

export {
  createIssueComment,
  deleteIssueComment,
  fetchIssueComments,
  updateIssueComment,
}
