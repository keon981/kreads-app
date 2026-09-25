'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { createIssue } from '@/server/issues'
import { getFormDataValue } from '@/utils/toolkit'

import type { PostFormState } from './type'

const PostFormSchema = z.object({
  content: z.string().trim().min(1, '請輸入內容'),
})

export async function createPostAction(
  _prev: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const content = getFormDataValue(formData, 'content')
  const result = PostFormSchema.safeParse({ content })
  if (!result.success) {
    return {
      message: result.error.issues[0].message,
      content,
    }
  }

  const success = await createIssue(result.data.content)
  if (!success) return { message: '發文失敗，請再試一次', content }

  // TODO: useOptimistic
  refresh()
  return {}
}
