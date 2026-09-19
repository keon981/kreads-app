import { headers } from 'next/headers'

import { cache } from 'react'

import { Octokit } from '@octokit/rest'

import { auth, getListUserAccounts } from '@/lib/auth'

export async function getGitHubToken() {
  const accounts = await getListUserAccounts()
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

export const getGitHubUser = cache(async () => {
  const token = await getGitHubToken()
  if (!token) return null

  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.rest.users.getAuthenticated()
  return data
})

export async function hasGitHubScope(scope: string) {
  const accounts = await getListUserAccounts()
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
