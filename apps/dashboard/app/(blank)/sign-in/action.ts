'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { APIError } from 'better-auth/api'
import * as z from 'zod'

import { REDIRECT_PARAM } from '@/configs/constants'
import { auth } from '@/lib/auth'

import { RedirectPathSchema } from './data'

import type { ActionState } from '@workspace/server/types/action'

const SignInSchema = z.object({
  email: z.string().trim().min(1, '請輸入 Email 與密碼'),
  password: z.string().min(1, '請輸入 Email 與密碼'),
})

export async function signInAction(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const parsedForm = SignInSchema.safeParse(Object.fromEntries(formData))
  if (!parsedForm.success) return { message: parsedForm.error.issues[0].message }

  try {
    const requestHeaders = await headers()
    await auth.api.signInEmail({ body: parsedForm.data, headers: requestHeaders })
  } catch (error) {
    if (!(error instanceof APIError)) throw error
    return { message: error.status === 'UNAUTHORIZED' ? 'Email 或密碼錯誤' : error.message }
  }

  const redirectTo = RedirectPathSchema.parse(formData.get(REDIRECT_PARAM))
  redirect(redirectTo)
}
