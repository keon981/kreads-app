import { Octokit } from '@octokit/rest'
import * as z from 'zod'

import { verifySession } from './auth'
import { getGitHubToken } from './github'

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

export async function fetchPost(): Promise<Post[]> {
  const session = await verifySession('/profile')
  const token = await getGitHubToken()
  const repoName = session.user.repoName
  if (!token || !repoName) return []
  const [owner, repo] = repoName.split('/')
  const octokit = new Octokit({ auth: token })

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

export { PostSchema, PostsResultSchema }
export type { Post }
