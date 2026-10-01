import { redirect } from 'next/navigation'

import { Octokit } from '@octokit/rest'

import { isUnauthorizedError } from '@/utils/toolkit'

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
