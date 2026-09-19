import { redirect } from 'next/navigation'

import React from 'react'

import { getSessionCache } from '@/lib/auth'
import { getGitHubUser, hasGitHubScope } from '@/lib/github'

import { SignUpForm } from './form'

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const session = await getSessionCache()
  if (!session || session?.user.repoName) redirect('/')
  const err = getError(error)
  // const [me, canWriteRepo, { error }] = await Promise.all([
  //   getGitHubUser(),
  //   hasGitHubScope('public_repo'),
  //   searchParams,
  // ])
  // if (!me) redirect('/')

  return (
    <section className="size-full flex flex-col justify-center items-center gap-8">
      <h2 className="text-3xl font-bold">
        Kreads APP
      </h2>
      <SignUpForm error={err} />
    </section>
  )
}

const errorMessage: Record<string, string> = {
  access_denied: 'GitHub 沒有完成授權，請再試一次。',
  no_permission: 'GitHub 授權不足，請重新授權。',
  invalid_name: '倉庫名稱不合法，請換一個。',
  repo_failed: '建立倉庫失敗，請再試一次。',
}

function getError(error?: string) {
  if (!error) return undefined
  return errorMessage[error] ?? error
}

export default Page
