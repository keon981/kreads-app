// 處理 github 帳戶權限

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { cache } from 'react'

import { Octokit } from '@octokit/rest'

import { auth, fetchListUserAccounts } from '@/lib/auth'
import { isRequestError, isUnauthorizedError } from '@/utils/status'

import type { UserRepo } from '@/types/user'

import 'server-only'

const SIGN_OUT_PATH = '/api/sign-out'

export function createOctokit(token?: string): Octokit {
  const octokit = new Octokit({ auth: token })

  // Octokit 發出的任何請求失敗時都會執行，自動處理 401 Error
  octokit.hook.error('request', (error) => {
    if (isUnauthorizedError(error)) redirect(SIGN_OUT_PATH)
    throw error
  })
  return octokit
}

export async function fetchAccessToken() {
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

export const fetchAccessTokenCache = cache(fetchAccessToken)

export const fetchGitHubUser = cache(async () => {
  const token = await fetchAccessTokenCache()
  if (!token) return null

  const octokit = createOctokit(token)
  const { data } = await octokit.rest.users.getAuthenticated()
  return data
})

export async function hasGitHubScope(scope: string) {
  const accounts = await fetchListUserAccounts()
  if (!accounts) return false

  const github = accounts.find(a => a.providerId === 'github')
  return github?.scopes.includes(scope) ?? false
}

export async function findOrCreateRepo(token: string, name: string) {
  const octokit = createOctokit(token)
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

export async function fetchUserRepo(repoName?: string | null): Promise<UserRepo & { error: boolean }> {
  const token = await fetchAccessTokenCache()

  const [owner, repo] = repoName?.split('/') ?? ['', '']

  return {
    octokit: createOctokit(token ?? undefined),
    owner,
    repo,
    error: !token,
  }
}
