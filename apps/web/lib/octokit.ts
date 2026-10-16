import { redirect } from 'next/navigation'

import { Octokit } from '@octokit/rest'

import { api } from '@/configs/path-config'
import { isUnauthorizedError } from '@/utils/toolkit'

import 'server-only'

export interface CreateOctokitOptions {
  autoSignOut?: boolean
}

export function createOctokit(
  token?: string,
  { autoSignOut = true }: CreateOctokitOptions = {},
): Octokit {
  const octokit = new Octokit({ auth: token })

  // auto handler 401 Error
  octokit.hook.error('request', (error) => {
    if (autoSignOut && isUnauthorizedError(error)) redirect(api.signOut)
    throw error
  })
  return octokit
}
