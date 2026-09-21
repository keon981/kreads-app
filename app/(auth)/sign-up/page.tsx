import { redirect } from 'next/navigation'

import React from 'react'

import { getSessionCache } from '@/lib/auth'
import { safeNext } from '@/lib/utils'

import { SignUpForm } from './form'

const errorMessages: Record<string, string> = {
  access_denied: 'GitHub 沒有完成授權，請再試一次。',
  no_permission: 'GitHub 授權不足，請重新授權。',
  invalid_name: '倉庫名稱不合法，請換一個。',
  repo_failed: '建立倉庫失敗，請再試一次。',
}

function getError(error?: string) {
  if (!error) return undefined
  return errorMessages[error] ?? error
}

async function Page({
  searchParams,
}: {
  searchParams: Promise<{ next?: string, error?: string }>
}) {
  const { next, error } = await searchParams
  const session = await getSessionCache()
  const nextPath = safeNext(next)
  if (!session) redirect('/sing-in')
  if (session.user.repoName) redirect(nextPath)
  const err = getError(error)

  return (
    <section className="size-full flex flex-col justify-center items-center gap-8">
      <h2 className="text-3xl font-bold">
        Kreads APP
      </h2>
      <SignUpForm error={err} nextPath={nextPath} />
    </section>
  )
}

export default Page
