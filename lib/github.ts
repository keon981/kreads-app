import { headers } from 'next/headers'

import { cache } from 'react'

import { Octokit } from '@octokit/rest'

import { auth, getSessionCache } from '@/lib/auth'

export async function getGitHubToken() {
  const session = await getSessionCache()
  if (!session) return null

  const nextHeaders = await headers()
  const accounts = await auth.api.listUserAccounts({ headers: nextHeaders })
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
