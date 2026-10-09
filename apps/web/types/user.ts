import type { Octokit } from '@octokit/rest'

interface ViewerUser {
  username: string
  name: string
  avatarUrl?: string
  repoName: string
}

interface UserRepo {
  octokit: Octokit
  owner: string
  repo: string
}
export type {
  UserRepo,
  ViewerUser,
}
