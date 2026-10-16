import { HttpStatusCode } from '@/configs/constants'
import { isGraphqlNotFoundError, isRequestError } from '@/utils/toolkit'

import { ISSUE_QUERY, ISSUES_QUERY } from '../graphql/issues'
import { isViewerReacted } from './reactions'

import type { Issue } from '@/types/issue'
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
      ? { login: issue.user.login, avatarUrl: issue.user.avatar_url }
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
async function fetchIssuesWithRest(
  { octokit, owner, repo }: UserRepo,
): Promise<Issue[] | null> {
  try {
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

    return data
      .filter(issue => !issue.pull_request) // 過濾 PR
      .map(toIssueFromRest)
  } catch (err) {
    // 404: user repo 改為 private or 刪除
    if (isRequestError(err) && err.status === HttpStatusCode.NotFound) return null
    throw err
  }
}

async function fetchIssuesWithGraphql({ octokit, owner, repo }: UserRepo,
): Promise<Issue[] | null> {
  try {
    const { repository } = await octokit.graphql<GraphqlIssuesResponse>(ISSUES_QUERY, {
      owner,
      repo,
      first: perPage,
    })

    return repository.issues.nodes.map(toIssueFromGraphql)
  } catch (err) {
    if (isGraphqlNotFoundError(err)) return null
    throw err
  }
}

async function fetchIssues(userRepo: UserRepo & { error: boolean }): Promise<Issue[] | null> {
  return (userRepo.error
    ? fetchIssuesWithRest(userRepo)
    : fetchIssuesWithGraphql(userRepo))
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
