'use server'

import { refresh } from 'next/cache'

import * as z from 'zod'

import { closeIssue } from '@/server/issues'

import type { ActionState } from '@/types/action'

const IssueNumberSchema = z.int().positive()

export async function deletePostAction(
  issueNumber: number,
): Promise<ActionState> {
  const result = IssueNumberSchema.safeParse(issueNumber)
  if (!result.success) return { status: 400, message: result.error.message }

  const status = await closeIssue(result.data)
  if (status !== 200) return { status, message: '刪除失敗，請再試一次' }

  refresh()
  return { status, message: '刪除成功' }
}
