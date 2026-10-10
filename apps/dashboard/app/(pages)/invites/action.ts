'use server'

import { revalidatePath } from 'next/cache'

import { randomBytes } from 'node:crypto'

import { deleteUnusedInvite, insertInvite } from '@/app/server/db/invites'
import { verifyAdmin } from '@/app/server/session'
import { paths } from '@/configs/path-config'

import type { ActionState } from '@workspace/server/types/action'
import type { CreateInviteState } from './types'

export async function createInviteAction(_prevState: CreateInviteState, formData: FormData): Promise<CreateInviteState> {
  await verifyAdmin()

  const code = randomBytes(12).toString('base64url')
  const note = `${formData.get('note') ?? ''}`.trim()
  await insertInvite(code, note || null)

  revalidatePath(paths.invites)
  return { code }
}

export async function deleteInviteAction(id: string): Promise<ActionState> {
  await verifyAdmin()
  if (!await deleteUnusedInvite(id)) return { message: '已使用的邀請碼無法刪除' }

  revalidatePath(paths.invites)
  return {}
}
