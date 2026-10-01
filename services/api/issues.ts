import { HTTP_STATUS } from '@/configs/constants'
import { isEqualWithCase, isGraphqlNotFoundError, isRequestError } from '@/utils/toolkit'

import { ISSUE_QUERY, ISSUES_QUERY } from '../graphql/issues'

import type { Issue } from '@/types/issue'
import type { UserRepo } from '@/types/user'
import type { GraphqlIssue, GraphqlIssueResponse, GraphqlIssuesResponse } from '../graphql/issues'

const ISSUES_PER_PAGE = 20
const LIKE_REACTION = 'heart'

/* === utils === */

function toIssueFromRest(issue: {
  number: number
  title: string
  body?: string | null
  created_at: string
  user: {
    login: string
    avatar_url: string
  } | null
  reactions?: {
    total_count: number
  }
  comments: number
}): Issue {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body ?? '',
    createdAt: issue.created_at,
    author: issue.user
      ? { login: issue.user.login, avatarUrl: issue.user.avatar_url }
      : null,
    likeCount: issue.reactions?.total_count ?? 0,
    isLiked: false,
    commentCount: issue.comments,
  }
}

function toIssueFromGraphql(issue: GraphqlIssue): Issue {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body,
    createdAt: issue.createdAt,
    author: issue.author,
    likeCount: issue.reactions.totalCount,
    isLiked: issue.reactionGroups?.some(
      group => isEqualWithCase(LIKE_REACTION, group.content) && group.viewerHasReacted,
    ) ?? false,
    commentCount: issue.comments.totalCount,
  }
}

/* === Repo Issues === */

//  issue list
async function fetchIssuesWithRest(
  { octokit, owner, repo }: UserRepo,
): Promise<Issue[]> {
  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    creator: owner,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: ISSUES_PER_PAGE,
  })

  return data
    .filter(issue => !issue.pull_request) // 過濾 PR
    .map(toIssueFromRest)
}

async function fetchIssuesWithGraphql({ octokit, owner, repo }: UserRepo,
): Promise<Issue[]> {
  const { repository } = await octokit.graphql<GraphqlIssuesResponse>(ISSUES_QUERY, {
    owner,
    repo,
    first: ISSUES_PER_PAGE,
  })

  return repository.issues.nodes.map(toIssueFromGraphql)
}

async function fetchIssues(userRepo: UserRepo & { error: boolean }): Promise<Issue[]> {
  return userRepo.error
    ? fetchIssuesWithRest(userRepo)
    : fetchIssuesWithGraphql(userRepo)
}

/* === Github Repo Issue === */

async function fetchIssueWithRest(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<Issue | null> {
  try {
    const { data: issue } = await octokit.rest.issues.get({
      owner,
      repo,
      issue_number: issueNumber,
    })
    if (issue.pull_request || issue.state !== 'open' || issue.user?.login !== owner) return null

    return toIssueFromRest(issue)
  } catch (err) {
    if (isRequestError(err) && err.status === HTTP_STATUS.NOT_FOUND) return null
    throw err
  }
}

async function fetchIssueWithGraphql(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<Issue | null> {
  try {
    const { repository: { issue } } = await octokit.graphql<GraphqlIssueResponse>(ISSUE_QUERY, {
      owner,
      repo,
      number: issueNumber,
    })
    if (issue.state !== 'OPEN' || issue.author?.login !== owner) return null

    return toIssueFromGraphql(issue)
  } catch (err) {
    if (isGraphqlNotFoundError(err)) return null
    throw err
  }
}

async function fetchIssue(
  userRepo: UserRepo & { error: boolean },
  issueNumber: number,
): Promise<Issue | null> {
  return userRepo.error
    ? fetchIssueWithRest(userRepo, issueNumber)
    : fetchIssueWithGraphql(userRepo, issueNumber)
}

async function createIssue(
  { octokit, owner, repo }: UserRepo,
  content: string,
): Promise<number> {
  const { status } = await octokit.rest.issues.create({
    owner,
    repo,
    title: `${Date.now()}`,
    body: content,
  })
  return status
}

async function closeIssue(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
): Promise<number> {
  const { status } = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    state: 'closed',
  })
  return status
}

export {
  closeIssue,
  createIssue,
  fetchIssue,
  fetchIssues,
}
