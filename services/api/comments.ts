import { PAGE_SIZE } from '@/configs/constants'

import type { IssueComment } from '@/types/issue'
import type { UserRepo } from '@/types/user'

function toIssueComment(comment: {
  id: number | bigint
  body?: string
  body_html?: string
  created_at: string
  user: {
    login: string
    avatar_url: string
  } | null
}): IssueComment {
  return {
    id: Number(comment.id),
    body: comment.body ?? '',
    bodyHTML: comment.body_html ?? '',
    createdAt: comment.created_at,
    author: comment.user
      ? { login: comment.user.login, avatarUrl: comment.user.avatar_url }
      : null,
  }
}

async function fetchIssueComments(
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
