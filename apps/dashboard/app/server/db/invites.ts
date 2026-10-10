import { db } from '@workspace/server/db/client'
import { user } from '@workspace/server/db/schema/auth-schema'
import { inviteCode } from '@workspace/server/db/schema/invite-schema'
import { and, desc, eq, isNull } from 'drizzle-orm'

import { isGithubUser } from '@/app/server/db/users'

import type { InviteRow } from '@/app/(pages)/invites/types'

import 'server-only'

export const isGithubAdmin = and(eq(user.role, 'admin'), isGithubUser)

interface InviteQueryRow {
  id?: string
  code: string
  note: string | null
  createdAt: Date
  redeemedAt: Date | null
  redeemerName: string | null
  redeemerUsername: string | null
  redeemerImage: string | null
}

const inviteFields = {
  code: inviteCode.code,
  note: inviteCode.note,
  createdAt: inviteCode.createdAt,
  redeemedAt: inviteCode.redeemedAt,
  redeemerName: user.name,
  redeemerUsername: user.username,
  redeemerImage: user.image,
}

export function maskInviteCode(code: string): string {
  return `${code.slice(0, 4)}${'•'.repeat(8)}`
}

function toInviteRow({ redeemerName, redeemerUsername, redeemerImage, ...row }: InviteQueryRow): InviteRow {
  return {
    ...row,
    status: row.redeemedAt ? 'redeemed' : 'unused',
    redeemer: redeemerName === null ? null : { name: redeemerName, username: redeemerUsername, image: redeemerImage },
  }
}

// viewer gets one masked row: unused codes could be used to sign up if they leaked
export async function fetchInvites(isAdmin: boolean): Promise<InviteRow[]> {
  if (isAdmin) {
    const rows = await db
      .select({ ...inviteFields, id: inviteCode.id })
      .from(inviteCode)
      .leftJoin(user, eq(inviteCode.redeemedBy, user.id))
      .orderBy(desc(inviteCode.createdAt))
    return rows.map(toInviteRow)
  }

  const rows = await db
    .select(inviteFields)
    .from(inviteCode)
    .innerJoin(user, eq(inviteCode.redeemedBy, user.id))
    .where(isGithubAdmin)
  return rows.map(row => toInviteRow({ ...row, code: maskInviteCode(row.code) }))
}

export async function insertInvite(code: string, note: string | null): Promise<void> {
  await db.insert(inviteCode).values({ id: crypto.randomUUID(), code, note })
}

// Only unused codes are deleted, whatever the UI sends
export async function deleteUnusedInvite(id: string): Promise<boolean> {
  const deleted = await db
    .delete(inviteCode)
    .where(and(eq(inviteCode.id, id), isNull(inviteCode.redeemedAt)))
    .returning({ id: inviteCode.id })
  return deleted.length > 0
}
