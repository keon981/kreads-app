import { HttpStatusCode } from '@/configs/constants'
import { env } from '@/lib/env'
import { applyGuestCacheLife } from '@/lib/guest-cache'
import { fetchUserRepo } from '@/services/user-repo'
import { getActionData, isGraphqlNotFoundError, isRequestError } from '@/utils/toolkit'
import { getRepoName } from '@/utils/user'

import { ISSUE_QUERY, ISSUES_QUERY } from '../graphql/issues'
import { isViewerReacted } from './reactions'

import type { IssueActionState } from '@/types/action'
import type { Issue, IssuePage } from '@/types/issue'
import type { UserRepo } from '@/types/user'
import type { GraphqlIssue, GraphqlIssueResponse, GraphqlIssuesResponse } from '../graphql/issues'

const perPage = 20

/* === utils === */

const HTML_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: '\'',
  nbsp: ' ',
}

// Plain text from GitHub's sanitized body_html, keeping line breaks between blocks
function getTextFromHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>|<\/(?:p|li|h[1-6]|blockquote|pre|div|tr)>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&(?:#(\d+)|#x([\da-f]+)|(\w+));/gi, (entity, dec?: string, hex?: string, name?: string) => {
      if (dec) return String.fromCodePoint(Number(dec))
      if (hex) return String.fromCodePoint(Number.parseInt(hex, 16))
      return HTML_ENTITIES[name?.toLowerCase() ?? ''] ?? entity
    })
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function toIssueFromRest(issue: {
  number: number
  title: string
  body?: string | null
  body_html?: string
  created_at: string
  user: {
    login: string
    avatar_url: string
  } | null
  reactions?: {
    heart: number
  }
  comments: number
}): Issue {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body ?? '',
    bodyHTML: issue.body_html ?? '',
    bodyText: getTextFromHtml(issue.body_html ?? ''),
    createdAt: issue.created_at,
    author: issue.user
      ? { login: issue.user.login, image: issue.user.avatar_url }
      : null,
    reactionCount: issue.reactions?.heart ?? 0,
    isReacted: false,
    commentCount: issue.comments,
  }
}

function toIssueFromGraphql(issue: GraphqlIssue): Issue {
  return {
    number: issue.number,
    title: issue.title,
    body: issue.body,
    bodyHTML: issue.bodyHTML,
    bodyText: getTextFromHtml(issue.bodyHTML),
    createdAt: issue.createdAt,
    author: issue.author,
    reactionCount: issue.reactions.totalCount,
    isReacted: isViewerReacted(issue.reactionGroups),
    commentCount: issue.comments.totalCount,
  }
}

/* === Repo Issues === */

//  issue list
async function fetchIssuesWithRest(repoName: string): Promise<IssueActionState<IssuePage | null>> {
  'use cache: remote'

  return applyGuestCacheLife(async () => {
    const { octokit, owner, repo } = fetchUserRepo(null, repoName)

    try {
      // Fetch a full page: PRs are filtered out afterwards and isTruncated must see past the limit
      const { data } = await octokit.rest.issues.listForRepo({
        owner,
        repo,
        creator: owner,
        state: 'open',
        sort: 'created',
        direction: 'desc',
        per_page: perPage,
        mediaType: { format: 'full' }, // return body & body_html
      })
      const posts = data
        .filter(issue => !issue.pull_request) // 過濾 PR
        .map(toIssueFromRest)

      return {
        posts: posts.slice(0, env.GUEST_POST_LIMIT),
        nextCursor: null,
        isTruncated: posts.length > env.GUEST_POST_LIMIT,
      }
    } catch (err) {
      // 404: user repo 改為 private or 刪除
      if (isRequestError(err) && err.status === HttpStatusCode.NotFound) return null
      throw err
    }
  })
}

async function fetchIssuesWithGraphql(
  { octokit, owner, repo }: UserRepo,
  cursor: string | null,
): Promise<IssuePage | null> {
  try {
    const { repository } = await octokit.graphql<GraphqlIssuesResponse>(ISSUES_QUERY, {
      owner,
      repo,
      first: perPage,
      after: cursor,
    })
    const { nodes, pageInfo } = repository.issues

    return {
      posts: nodes.map(toIssueFromGraphql),
      nextCursor: pageInfo.hasNextPage ? pageInfo.endCursor : null,
      isTruncated: false,
    }
  } catch (err) {
    if (isGraphqlNotFoundError(err)) return null
    throw err
  }
}

async function fetchIssues(
  userRepo: UserRepo & { error: boolean },
  cursor: string | null = null,
): Promise<IssuePage | null> {
  if (!userRepo.error) return fetchIssuesWithGraphql(userRepo, cursor)

  // A cursor on the guest path means the viewer token expired mid-scroll; returning page 1 again would duplicate posts
  if (cursor) return { posts: [], nextCursor: null, isTruncated: false }

  const postsResult = await fetchIssuesWithRest(getRepoName(userRepo))
  return getActionData(postsResult)
}

/* === Github Repo Issue === */

async function fetchIssueWithRest(repoName: string, issueNumber: number): Promise<IssueActionState<Issue | null>> {
  'use cache: remote'

  return applyGuestCacheLife(async () => {
    const { octokit, owner, repo } = fetchUserRepo(null, repoName)

    try {
      const { data: issue } = await octokit.rest.issues.get({
        owner,
        repo,
        issue_number: issueNumber,
        mediaType: { format: 'full' }, // return body & body_html
      })
      if (issue.pull_request || issue.state !== 'open' || issue.user?.login !== owner) return null

      return toIssueFromRest(issue)
    } catch (err) {
      const nonoRepo = [HttpStatusCode.NotFound, HttpStatusCode.Gone]
      const isUnavailable = isRequestError(err) && nonoRepo.includes(err.status)
      if (isUnavailable) return null
      throw err
    }
  })
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
  if (!userRepo.error) return fetchIssueWithGraphql(userRepo, issueNumber)

  const postResult = await fetchIssueWithRest(getRepoName(userRepo), issueNumber)
  return getActionData(postResult)
}

async function createIssue(
  { octokit, owner, repo }: UserRepo,
  content: string,
): Promise<Issue> {
  const { data } = await octokit.rest.issues.create({
    owner,
    repo,
    title: `${Date.now()}`,
    body: content,
    mediaType: { format: 'full' },
  })
  return toIssueFromRest(data)
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

async function updateIssue(
  { octokit, owner, repo }: UserRepo,
  issueNumber: number,
  content: string,
): Promise<Issue> {
  const { data } = await octokit.rest.issues.update({
    owner,
    repo,
    issue_number: issueNumber,
    body: content,
    mediaType: { format: 'full' },
  })
  return toIssueFromRest(data)
}

export {
  closeIssue,
  createIssue,
  fetchIssue,
  fetchIssues,
  updateIssue,
}
