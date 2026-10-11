'use server'

import { revalidatePath } from 'next/cache'

import * as z from 'zod'

import { randomBytes } from 'node:crypto'

import { deleteUnusedInvite, insertInvite } from '@/app/server/db/invites'
import { verifyAdmin } from '@/app/server/session'
import { paths } from '@/configs/path-config'

import type { ActionState } from '@workspace/server/types/action'
import type { CreateInviteState } from '@/types/invite'

const CreateInviteSchema = z.object({
  note: z.string().trim().optional().transform(note => note || null),
})

const InviteIdSchema = z.string().min(1, '找不到此邀請碼')

export async function createInviteAction(_prevState: CreateInviteState, formData: FormData): Promise<CreateInviteState> {
  await verifyAdmin()

  const parsedForm = CreateInviteSchema.safeParse(Object.fromEntries(formData))
  if (!parsedForm.success) return { message: parsedForm.error.issues[0].message }

  const code = randomBytes(12).toString('base64url')
  await insertInvite(code, parsedForm.data.note)

  revalidatePath(paths.keys)
  return { code }
}

export async function deleteInviteAction(id: string): Promise<ActionState> {
  await verifyAdmin()

  const parsedId = InviteIdSchema.safeParse(id)
  if (!parsedId.success) return { message: parsedId.error.issues[0].message }

  const isDeleted = await deleteUnusedInvite(parsedId.data)
  if (!isDeleted) return { message: '已使用的邀請碼無法刪除' }

  revalidatePath(paths.keys)
  return {}
}
