// 處理 github repo

import { Octokit } from '@octokit/rest'
import * as z from 'zod'

import { verifySession } from './auth'
import { fetchGitHubToken } from './github'

import type { AuthSession } from '@/types/auth'

const PostSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string(),
  createdAt: z.iso.datetime(),
  author: z.object({
    login: z.string(),
    avatarUrl: z.url(),
  }).nullable(),
})

type Post = z.infer<typeof PostSchema>

const PostsResultSchema = z.object({
  repository: z.object({
    issues: z.object({
      nodes: z.array(PostSchema),
    }),
  }),
})

function getUserRepo(user: AuthSession['user']) {
  if (!user.repoName) return null
  const [owner, repo] = user.repoName.split('/')
  return [owner, repo]
}

async function fetchUserRepo() {
  const session = await verifySession()
  const token = await fetchGitHubToken()
  const userRepo = getUserRepo(session.user)
  if (!token || !userRepo) return null

  const [owner, repo] = userRepo
  return {
    octokit: new Octokit({ auth: token }),
    owner,
    repo,
  }
}

async function fetchUserIssues(): Promise<Post[]> {
  const userRepo = await fetchUserRepo()
  if (!userRepo) return []
  const { octokit, owner, repo } = userRepo

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
  } catch {
    return false
  }
}

export {
  createIssue,
  fetchUserIssues,
  fetchUserRepo,
  PostSchema,
  PostsResultSchema,
}
export type { Post }
