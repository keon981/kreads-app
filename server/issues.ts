// 處理貼文（GitHub Issues）

import { Octokit } from '@octokit/rest'

import { isRequestError } from '@/utils/status'

import { fetchGitHubToken, fetchUserRepo } from './github'

import type { Post } from '@/types/post'

import 'server-only'

async function fetchIssues(repoName: string): Promise<Post[]> {
  const [owner, repo] = repoName.split('/')
  const token = await fetchGitHubToken()
  const octokit = new Octokit({ auth: token ?? undefined })

  const { data } = await octokit.rest.issues.listForRepo({
    owner,
    repo,
    creator: owner,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: 20,
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
    })) // 只回傳必要欄位
}

async function createIssue(content: string) {
  const userRepo = await fetchUserRepo()
  if (!userRepo) return false
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
  const userRepo = await fetchUserRepo()
  if (!userRepo) return 401
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
