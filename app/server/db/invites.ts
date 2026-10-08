import { and, count, eq, isNull } from 'drizzle-orm'

import { db } from '@/db/drizzle'
import { user } from '@/db/schema/auth-schema'
import { inviteCode as inviteCodeTable } from '@/db/schema/invite-schema'
import { env } from '@/lib/env'
import { isAdminRole } from '@/utils/user'

import type { InviteCodeStatus, RedeemResult } from '@/types/invite'

import 'server-only'

type UserInviteCodeResult
  = | { status: 'valid', inviterId: string }
    | { status: Exclude<InviteCodeStatus, 'valid'> }

async function getUserInviteCodeStatus(code: string): Promise<UserInviteCodeResult> {
  const [inviter] = await db
    .select({ id: user.id, role: user.role })
    .from(user)
    .where(eq(user.inviteCode, code))
    .limit(1)
  if (!inviter) return { status: 'invalid' }
  if (isAdminRole(inviter.role)) return { status: 'valid', inviterId: inviter.id }

  const [{ invited }] = await db
    .select({ invited: count() })
    .from(user)
    .where(eq(user.invitedBy, inviter.id))
  if (invited >= env.INVITE_LIMIT) return { status: 'limit' }

  return { status: 'valid', inviterId: inviter.id }
}

async function getInviteCodeStatus(code: string): Promise<InviteCodeStatus> {
  const [invite] = await db
    .select({ id: inviteCodeTable.id })
    .from(inviteCodeTable)
    .where(and(eq(inviteCodeTable.code, code), isNull(inviteCodeTable.redeemedAt)))
    .limit(1)
  if (invite) return 'valid'

  return (await getUserInviteCodeStatus(code)).status
}

// One-time codes are redeemed first; otherwise the code is treated as a user's personal invite code
async function redeemInviteCode(code: string, userId: string): Promise<RedeemResult> {
  const redeemed = await db
    .update(inviteCodeTable)
    .set({ redeemedBy: userId, redeemedAt: new Date() })
    .where(and(eq(inviteCodeTable.code, code), isNull(inviteCodeTable.redeemedAt)))
    .returning({ id: inviteCodeTable.id })
  if (redeemed.length > 0) return { status: 'valid', invitedBy: null }

  const result = await getUserInviteCodeStatus(code)
  if (result.status !== 'valid') return result
  if (result.inviterId === userId) return { status: 'invalid' }

  return { status: 'valid', invitedBy: result.inviterId }
}

export {
  getInviteCodeStatus,
  redeemInviteCode,
}
