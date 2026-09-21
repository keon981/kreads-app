'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth, getSessionCache, signUpPath } from '@/lib/auth'

export interface SignUpRes {
  message?: string
}

export async function completeSignUpAction(
  _prevState: SignUpRes,
  formData: FormData,
): Promise<SignUpRes> {
  // return path
  const nextPath = String(formData.get('next_path'))

  // verify
  const session = await getSessionCache()
  if (!session) redirect('/sign-in') // 登入失敗 or 登入過期，跳到登入頁面重新登入或註冊
  if (session.user.repoName) redirect(nextPath)

  // get form
  const repoName = formData.get('repo_name')
  const repo = String(repoName).trim()

  // 取得 github 授權
  const { url } = await auth.api.linkSocialAccount({
    body: {
      provider: 'github',
      scopes: ['public_repo'],
      callbackURL: `/api/sign-up?${new URLSearchParams({ repo, next: nextPath })}`,
      errorCallbackURL: signUpPath(nextPath),
    },
    headers: await headers(),
  })

  redirect(url)
}
