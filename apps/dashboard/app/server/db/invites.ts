import { cacheLife, cacheTag } from 'next/cache'

import { db } from '@workspace/server/db/client'
import { user } from '@workspace/server/db/schema/auth-schema'
import { inviteCode } from '@workspace/server/db/schema/invite-schema'
import { and, desc, eq, inArray, isNull } from 'drizzle-orm'

import { getVisibleUserFilter, toAssignableRole } from '@/app/server/db/users'

import type { PublicAudience } from '@workspace/server/types/revalidate'
import type { InviteRow } from '@/types/invite'
import type { AssignableRole, Audience } from '@/types/user'

import 'server-only'

interface InviteQueryRow {
  id?: string
  code: string
  role: string
  createdAt: Date
  redeemedAt: Date | null
  redeemerName: string | null
  redeemerUsername: string | null
  redeemerImage: string | null
  redeemerRole: string | null
}

const inviteFields = {
  code: inviteCode.code,
  role: inviteCode.role,
  createdAt: inviteCode.createdAt,
  redeemedAt: inviteCode.redeemedAt,
  redeemerName: user.name,
  redeemerUsername: user.username,
  redeemerImage: user.image,
  redeemerRole: user.role,
}

export function maskInviteCode(code: string): string {
  return `${code.slice(0, 4)}${'•'.repeat(8)}`
}

function toInviteRow({ redeemerName, redeemerUsername, redeemerImage, redeemerRole, role, ...row }: InviteQueryRow): InviteRow {
  const hasRedeemer = redeemerName !== null

  return {
    ...row,
    role: toAssignableRole(hasRedeemer ? redeemerRole : role),
    status: row.redeemedAt ? 'redeemed' : 'unused',
    redeemer: hasRedeemer ? { name: redeemerName, username: redeemerUsername, image: redeemerImage } : null,
  }
}

// Non-admins only get masked codes redeemed by users they can see: unused codes could be used to sign up if they leaked
export async function fetchInvites(audience: Audience): Promise<InviteRow[]> {
  if (audience === 'admin') {
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
    .where(getVisibleUserFilter(audience))
    .orderBy(desc(inviteCode.createdAt))
  return rows.map(row => toInviteRow({ ...row, code: maskInviteCode(row.code) }))
}

// Same lifetimes as fetchCachedUsers: guests only see site admins' codes, which rarely change
export async function fetchCachedInvites(audience: PublicAudience): Promise<InviteRow[]> {
  'use cache: remote'
  cacheTag(audience)

  if (audience === 'guest') {
    cacheLife('weeks')
  } else {
    cacheLife('days')
  }

  return fetchInvites(audience)
}

export async function fetchInviteRedeemer(id: string): Promise<{ redeemedBy: string | null } | undefined> {
  const [found] = await db
    .select({ redeemedBy: inviteCode.redeemedBy })
    .from(inviteCode)
    .where(eq(inviteCode.id, id))
    .limit(1)
  return found
}

export async function insertInvite(code: string, role: AssignableRole): Promise<void> {
  await db.insert(inviteCode).values({ id: crypto.randomUUID(), code, role })
}

// The unused check runs in the same query, so a code redeemed in the meantime is left alone and its redeemer gets the role instead
export async function updateUnusedInviteRole(id: string, role: AssignableRole): Promise<boolean> {
  const updated = await db
    .update(inviteCode)
    .set({ role })
    .where(and(eq(inviteCode.id, id), isNull(inviteCode.redeemedAt)))
    .returning({ id: inviteCode.id })
  return updated.length > 0
}

// Only unused codes are deleted, whatever the UI sends
export async function deleteUnusedInvites(ids: string[]): Promise<number> {
  const deleted = await db
    .delete(inviteCode)
    .where(and(inArray(inviteCode.id, ids), isNull(inviteCode.redeemedAt)))
    .returning({ id: inviteCode.id })
  return deleted.length
}
