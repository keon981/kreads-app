import { redirect } from 'next/navigation'

import { Octokit } from '@octokit/rest'

import { SIGN_OUT_PATH } from '@/configs/constants'
import { isUnauthorizedError } from '@/utils/toolkit'

import 'server-only'

export function createOctokit(token?: string): Octokit {
  const octokit = new Octokit({ auth: token })

  // auto handler 401 Error
  octokit.hook.error('request', (error) => {
    if (isUnauthorizedError(error)) redirect(SIGN_OUT_PATH)
    throw error
  })
  return octokit
}
