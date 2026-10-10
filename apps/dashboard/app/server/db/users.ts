import { db } from '@workspace/server/db/client'
import { account, session, user } from '@workspace/server/db/schema/auth-schema'
import { and, count, desc, eq, exists, gt, max } from 'drizzle-orm'

import type { UserRow, UserStatus } from '@/app/(pages)/users/types'

import 'server-only'

// Dashboard accounts share the admin role, so site users are told apart by their GitHub account
export const isGithubUser = exists(
  db.select({ id: account.id }).from(account).where(and(eq(account.userId, user.id), eq(account.providerId, 'github'))),
)

const viewerFields = {
  name: user.name,
  username: user.username,
  image: user.image,
  banned: user.banned,
  banExpires: user.banExpires,
  createdAt: user.createdAt,
}

function getUserStatus({ banned, banExpires }: { banned: boolean | null, banExpires: Date | null }): UserStatus {
  return banned && (!banExpires || banExpires > new Date()) ? 'banned' : 'active'
}

// The viewer query never selects email or id, so they cannot leak to its browser
export async function fetchUsers(isAdmin: boolean): Promise<UserRow[]> {
  const rows = isAdmin
    ? await db.select({ ...viewerFields, id: user.id, email: user.email }).from(user).where(isGithubUser).orderBy(desc(user.createdAt))
    : await db.select(viewerFields).from(user).where(isGithubUser).orderBy(desc(user.createdAt))

  return rows.map(({ banned, banExpires, ...row }) => ({ ...row, status: getUserStatus({ banned, banExpires }) }))
}

export async function isManagedUser(userId: string): Promise<boolean> {
  const [found] = await db.select({ id: user.id }).from(user).where(and(eq(user.id, userId), isGithubUser)).limit(1)
  return !!found
}

export async function isEmailTaken(email: string): Promise<boolean> {
  const [found] = await db.select({ id: user.id }).from(user).where(eq(user.email, email.toLowerCase())).limit(1)
  return !!found
}

export async function fetchSessionSummary(userId: string): Promise<{ activeSessions: number, lastSignInAt: Date | null }> {
  const [summary] = await db
    .select({ activeSessions: count(), lastSignInAt: max(session.createdAt) })
    .from(session)
    .where(and(eq(session.userId, userId), gt(session.expiresAt, new Date())))
  return summary
}
