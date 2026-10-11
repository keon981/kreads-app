'use server'

import { revalidatePath } from 'next/cache'

import * as z from 'zod'

import { randomBytes } from 'node:crypto'

import { deleteUnusedInvites, fetchInviteRedeemer, insertInvite, updateUnusedInviteRole } from '@/app/server/db/invites'
import { verifyAdmin } from '@/app/server/session'
import { assignUserRole } from '@/app/server/user-role'
import { defaultRole } from '@/configs/auth-config'
import { paths } from '@/configs/path-config'
import { AssignableRoleSchema } from '@/types/user'

import type { ActionState } from '@workspace/server/types/action'
import type { DeleteInvitesState } from '@/types/invite'

const InviteRoleSchema = z.object({
  role: AssignableRoleSchema,
})

const InviteIdSchema = z.string().min(1, '找不到此邀請碼')

const InviteIdsSchema = z.array(InviteIdSchema).min(1, '沒有選擇邀請碼')

export async function createInviteAction(): Promise<ActionState> {
  await verifyAdmin()

  const code = randomBytes(12).toString('base64url')
  await insertInvite(code, defaultRole)

  revalidatePath(paths.keys)
  return {}
}

// Unused codes keep the role for sign-up; redeemed codes change their redeemer's role instead
export async function updateInviteAction(id: string, _prevState: ActionState, formData: FormData): Promise<ActionState> {
  await verifyAdmin()

  const parsedId = InviteIdSchema.safeParse(id)
  if (!parsedId.success) return { message: parsedId.error.issues[0].message }

  const parsedForm = InviteRoleSchema.safeParse(Object.fromEntries(formData))
  if (!parsedForm.success) return { message: '無效的分組' }

  const { role } = parsedForm.data
  const isUpdated = await updateUnusedInviteRole(parsedId.data, role)
  if (!isUpdated) {
    const invite = await fetchInviteRedeemer(parsedId.data)
    if (!invite) return { message: '找不到此邀請碼' }
    if (!invite.redeemedBy) return { message: '核銷人已刪除，無法變更分組' }

    const result = await assignUserRole(invite.redeemedBy, role)
    if (result.message) return result
    revalidatePath(paths.users)
  }

  revalidatePath(paths.keys)
  return {}
}

export async function deleteInvitesAction(ids: string[]): Promise<DeleteInvitesState> {
  await verifyAdmin()

  const parsedIds = InviteIdsSchema.safeParse(ids)
  if (!parsedIds.success) return { message: parsedIds.error.issues[0].message }

  const count = await deleteUnusedInvites(parsedIds.data)
  if (count === 0) return { message: '已使用的邀請碼無法刪除' }

  revalidatePath(paths.keys)
  return { count }
}
