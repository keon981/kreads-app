'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth, getSessionCache } from '@/lib/auth'

export interface SignUpState {
  message?: string
}

export async function completeSignUpAction(
  _prevState: SignUpState,
  formData: FormData,
): Promise<SignUpState> {
  // verify
  const session = await getSessionCache()
  if (!session) redirect('/sign-in')
  if (session.user.repoName) redirect('/')

  // get form
  const repoName = formData.get('repo_name')
  const repo = String(repoName).trim()

  // 取得 github 授權
  const { url } = await auth.api.linkSocialAccount({
    body: {
      provider: 'github',
      scopes: ['public_repo'],
      callbackURL: `/api/sign-up?${new URLSearchParams({ repo })}`,
      errorCallbackURL: '/sign-up',
    },
    headers: await headers(),
  })

  redirect(url)
}
