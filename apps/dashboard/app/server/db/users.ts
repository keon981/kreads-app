import { cacheLife, cacheTag } from 'next/cache'

import { hasRole } from '@workspace/server/auth/access'
import { db } from '@workspace/server/db/client'
import { account, session, user } from '@workspace/server/db/schema/auth-schema'
import { and, count, desc, eq, exists, gt, max, or } from 'drizzle-orm'

import type { PublicAudience } from '@workspace/server/types/revalidate'
import type { SQL } from 'drizzle-orm'
import type { AssignableRole, Audience, UserRow, UserStatus } from '@/types/user'

import 'server-only'

// Dashboard accounts share the admin role, so site users are told apart by their GitHub account
export const isGithubUser = exists(
  db
    .select({ id: account.id })
    .from(account)
    .where(
      and(eq(account.userId, user.id), eq(account.providerId, 'github')),
    ),
)

const isAdminRole = eq(user.role, 'admin')

const isPublicUser = eq(user.isPublic, true)

export function getVisibleUserFilter(audience: Audience): SQL | undefined {
  if (audience === 'admin') return isGithubUser
  if (audience === 'viewer') return and(isGithubUser, or(isAdminRole, isPublicUser))
  return and(isGithubUser, isAdminRole)
}

export function toAssignableRole(role: string | null): AssignableRole {
  return hasRole(role, 'admin') ? 'admin' : 'user'
}

function getUserStatus({ banned, banExpires }: { banned: boolean | null, banExpires: Date | null }): UserStatus {
  return banned && (!banExpires || banExpires > new Date()) ? 'banned' : 'active'
}

export async function fetchUsers(audience: Audience): Promise<UserRow[]> {
  const visibleUsers = getVisibleUserFilter(audience)
  const rows = await db
    .select({
      name: user.name,
      username: user.username,
      image: user.image,
      role: user.role,
      banned: user.banned,
      banExpires: user.banExpires,
      createdAt: user.createdAt,
      ...(audience === 'admin'
        ? {
            id: user.id,
            email: user.email,
            isPublic: user.isPublic,
          }
        : {}),
    })
    .from(user)
    .where(visibleUsers)
    .orderBy(desc(user.createdAt))

  return rows.map(({ banned, banExpires, role, ...row }) => ({
    ...row,
    role: toAssignableRole(role),
    status: getUserStatus({ banned, banExpires }),
  }))
}

// Guests only see site admins, which rarely change, so their copy lives longer than viewer's
export async function fetchUsersCache(audience: PublicAudience): Promise<UserRow[]> {
  'use cache: remote'
  cacheTag(audience)
  if (audience === 'guest') {
    cacheLife('weeks')
  } else {
    cacheLife('days')
  }

  return fetchUsers(audience)
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
