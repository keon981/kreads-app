import { headers } from 'next/headers'

import { Octokit } from '@octokit/rest'

import { auth } from '@/lib/auth'

export async function getGitHubToken() {
  const nextHeaders = await headers()

  const session = await auth.api.getSession({ headers: nextHeaders })
  if (!session) return null

  const accounts = await auth.api.listUserAccounts({ headers: nextHeaders })
  const github = accounts.find(a => a.providerId === 'github')
  if (!github) return null

  const { accessToken } = await auth.api.getAccessToken({
    body: { accountId: github.id },
    headers: nextHeaders,
  })

  return accessToken
}

export async function getGitHubUser() {
  const token = await getGitHubToken()
  if (!token) return null

  const octokit = new Octokit({ auth: token })
  const { data } = await octokit.rest.users.getAuthenticated()
  return data
}
