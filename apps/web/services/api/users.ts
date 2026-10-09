import { cache } from 'react'

import { createOctokit } from '@/lib/octokit'
import { isRequestError } from '@/utils/toolkit'

const fetchGitHubUser = cache(async (token: string) => {
  const octokit = createOctokit(token)
  const { data } = await octokit.rest.users.getAuthenticated()
  return data
})

async function findOrCreateRepo(token: string, name: string) {
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

export {
  fetchGitHubUser,
  findOrCreateRepo,
}
