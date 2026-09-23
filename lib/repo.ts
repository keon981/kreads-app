// 處理 github repo

import { Octokit } from '@octokit/rest'
import { eq } from 'drizzle-orm'
import * as z from 'zod'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'

import { verifySession } from './auth'
import { fetchGitHubToken } from './github'

import type { AuthSession } from '@/types/auth'
import type { ViewerUser } from '@/types/user'

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
  } catch {
    return false
  }
}

function toViewerUser(data: {
  name: string
  image?: string | null
  username?: string | null
  repoName?: string | null
}): ViewerUser | null {
  if (!data.username || !data.repoName) return null
  return {
    username: data.username,
    name: data.name,
    avatarUrl: data.image ?? undefined,
    repoName: data.repoName,
  }
}

async function fetchViewerUser(username: string) {
  const [foundUser] = await db
    .select({
      name: user.name,
      image: user.image,
      username: user.username,
      repoName: user.repoName,
    })
    .from(user)
    .where(eq(user.username, username))
    .limit(1)

  return foundUser ? toViewerUser(foundUser) : null
}

export {
  createIssue,
  fetchIssues as fetchUserIssues,
  fetchUserRepo,
  fetchViewerUser,
  PostSchema,
  PostsResultSchema,
  toViewerUser,
}
export type { Post }
