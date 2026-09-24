// 處理 github 帳戶權限

import { headers } from 'next/headers'

import { cache } from 'react'

import { Octokit } from '@octokit/rest'

import { auth, fetchListUserAccounts, verifySession } from '@/lib/auth'

import type { AuthSession } from '@/types/auth'

import 'server-only'

export async function fetchGitHubToken() {
  const accounts = await fetchListUserAccounts()
  const nextHeaders = await headers()
  if (!accounts || !nextHeaders) return null

  const github = accounts.find(a => a.providerId === 'github')
  if (!github) return null

  const { accessToken } = await auth.api.getAccessToken({
    body: { accountId: github.id },
    headers: nextHeaders,
  })

  return accessToken
}

export const fetchGitHubUser = cache(async () => {
  const token = await fetchGitHubToken()
  if (!token) return null

  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.rest.users.getAuthenticated()
  return data
})

export async function hasGitHubScope(scope: string) {
  const accounts = await fetchListUserAccounts()
  if (!accounts) return false

  const github = accounts.find(a => a.providerId === 'github')
  return github?.scopes.includes(scope) ?? false
}

export function isRequestError(
  error: unknown,
): error is Error & { status: number } {
  return error instanceof Error && 'status' in error
}

export async function findOrCreateRepo(token: string, name: string) {
  const octokit = new Octokit({ auth: token })
  const { data: me } = await octokit.rest.users.getAuthenticated()

  try {
    const { data } = await octokit.rest.repos.get({
      owner: me.login,
      repo: name,
    })
    return data
  } catch (error) {
    if (!isRequestError(error) || error.status !== 404) throw error
  }

  const { data } = await octokit.rest.repos.createForAuthenticatedUser({
    name,
    private: false,
    auto_init: true,
  })
  return data
}

function getUserRepo(user: AuthSession['user']) {
  if (!user.repoName) return null
  const [owner, repo] = user.repoName.split('/')
  return [owner, repo]
}

export async function fetchUserRepo() {
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
