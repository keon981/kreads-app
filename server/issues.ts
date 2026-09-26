// 處理貼文（GitHub Issues）

import { getSessionCache } from '@/lib/auth'
import { HTTP_STATUS } from '@/types/http-status'
import { isRequestError } from '@/utils/status'
import { isEqualWithCase } from '@/utils/toolkit'

import { fetchUserRepo } from './github'
import { ISSUES_QUERY } from './graphql/issues'

import type { Issue } from '@/types/issue'
import type { UserRepo } from './github'
import type { GraphqlIssuesResponse } from './graphql/issues'

import 'server-only'

const ISSUES_PER_PAGE = 20
const LIKE_REACTION = 'heart'

/* === Github Repo Issues === */

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
    .map(issue => ({
      number: issue.number,
      title: issue.title,
      body: issue.body ?? '',
      createdAt: issue.created_at,
      author: issue.user
        ? { login: issue.user.login, avatarUrl: issue.user.avatar_url }
        : null,
      likeCount: issue.reactions?.total_count ?? 0,
      isLiked: false,
    }))
}

async function fetchIssuesWithGraphql({ octokit, owner, repo }: UserRepo,
): Promise<Issue[]> {
  const { repository } = await octokit.graphql<GraphqlIssuesResponse>(ISSUES_QUERY, {
    owner,
    repo,
    first: ISSUES_PER_PAGE,
  })

  return repository.issues.nodes.map(issue => ({
    number: issue.number,
    title: issue.title,
    body: issue.body,
    createdAt: issue.createdAt,
    author: issue.author,
    likeCount: issue.reactions.totalCount,
    isLiked: issue.reactionGroups?.some(
      group => isEqualWithCase(LIKE_REACTION, group.content) && group.viewerHasReacted,
    ) ?? false,
  }))
}

async function fetchIssues(repoName: string): Promise<Issue[]> {
  const userRepo = await fetchUserRepo(repoName)

  return userRepo.error
    ? fetchIssuesWithRest(userRepo)
    : fetchIssuesWithGraphql(userRepo)
}

async function createIssue(content: string) {
  const session = await getSessionCache()
  const userRepo = await fetchUserRepo(session?.user?.repoName)
  if (userRepo.error) return false

  const { octokit, owner, repo } = userRepo
  try {
    await octokit.rest.issues.create({
      owner,
      repo,
      title: `${Date.now()}`,
      body: content,
    })
    return true
  } catch (error) {
    if (!isRequestError(error)) throw error
    return false
  }
}

async function closeIssue(issueNumber: number) {
  const session = await getSessionCache()
  const userRepo = await fetchUserRepo(session?.user?.repoName)
  if (userRepo.error) return HTTP_STATUS.UNAUTHORIZED

  const { octokit, owner, repo } = userRepo
  try {
    const res = await octokit.rest.issues.update({
      owner,
      repo,
      issue_number: issueNumber,
      state: 'closed',
    })
    return res.status
  } catch (error) {
    if (!isRequestError(error)) throw error
    return error.status
  }
}

export {
  closeIssue,
  createIssue,
  fetchIssues,
}
