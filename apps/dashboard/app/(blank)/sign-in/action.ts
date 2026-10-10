'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { APIError } from 'better-auth/api'

import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

import type { ActionState } from '@workspace/server/types/action'

export async function signInAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = `${formData.get('email') ?? ''}`.trim()
  const password = `${formData.get('password') ?? ''}`
  if (!email || !password) return { message: '請輸入 Email 與密碼' }

  try {
    await auth.api.signInEmail({ body: { email, password }, headers: await headers() })
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.status === 'UNAUTHORIZED' ? 'Email 或密碼錯誤' : error.message }
  }

  redirect(paths.dashboard)
}
