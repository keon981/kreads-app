import { cacheLife, cacheTag } from 'next/cache'

import { db } from '@workspace/server/db/client'
import { session, user } from '@workspace/server/db/schema/auth-schema'
import { inviteCode } from '@workspace/server/db/schema/invite-schema'
import { SECONDS } from '@workspace/ui/configs/constants'
import { formatDateTime } from '@workspace/ui/lib/format'
import { and, count, desc, eq, gt, gte, isNotNull, isNull, or } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { maskInviteCode } from '@/app/server/db/invites'
import { getVisibleUserFilter, isGithubUser } from '@/app/server/db/users'

import type { PublicAudience } from '@workspace/server/types/revalidate'
import type {
  ActivityUser,
  DailyActivity,
  DashboardDetails,
  DashboardStats,
  DashboardSummary,
  InviterRank,
  RedeemedInvite,
} from '@/types/stats'
import type { Audience } from '@/types/user'

import 'server-only'

function getRecentDays(days: number): string[] {
  return Array.from({ length: days }, (_, index) => formatDateTime(Date.now() - (days - 1 - index) * SECONDS.day * 1000, { withTime: false }))
}

// formatDateTime uses the configured time zone, so rows are grouped by that zone's calendar day
function getCountsByDay(dates: (Date | null)[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const date of dates) {
    if (!date) continue
    const day = formatDateTime(date, { withTime: false })
    counts.set(day, (counts.get(day) ?? 0) + 1)
  }
  return counts
}

const getTime = (list: { time: Date | null }[]) => list.map(row => row.time)

export async function fetchDailyActivity(days: number): Promise<DailyActivity[]> {
  const recentDays = getRecentDays(days)
  // One extra day covers the start of the oldest calendar day in the configured zone
  const since = new Date(
    Date.now() - (days + 1) * SECONDS.day * 1000,
  )

  const [registrations, redemptions, logins] = await Promise.all([
    db
      .select({ time: user.createdAt })
      .from(user)
      .where(and(isGithubUser, gte(user.createdAt, since))),
    db
      .select({ time: inviteCode.redeemedAt })
      .from(inviteCode)
      .where(gte(inviteCode.redeemedAt, since)),
    db
      .select({ time: session.createdAt })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(and(isGithubUser, gte(session.createdAt, since))),
  ])

  const registrationMap = getCountsByDay(getTime(registrations))
  const redemptionMap = getCountsByDay(getTime(redemptions))
  const loginMap = getCountsByDay(getTime(logins))

  return recentDays.map(day => ({
    date: day.slice(5).replace('-', '/'),
    registrations: registrationMap.get(day) ?? 0,
    redemptions: redemptionMap.get(day) ?? 0,
    logins: loginMap.get(day) ?? 0,
  }))
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const now = new Date()
  const isBanned = and(
    eq(user.banned, true),
    or(isNull(user.banExpires), gt(user.banExpires, now)),
  )

  const [[users], bannedUsers, unregisteredUsers, [invites], [sessions]] = await Promise.all([
    db
      .select({ totalUsers: count(), invitedUsers: count(user.invitedBy) })
      .from(user)
      .where(isGithubUser),
    db.$count(user, and(isGithubUser, isBanned)),
    db.$count(user, and(isGithubUser, isNull(user.repoName))),
    db
      .select({ totalInvites: count(), redeemedInvites: count(inviteCode.redeemedAt) })
      .from(inviteCode),
    db
      .select({ activeSessions: count() })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(and(isGithubUser, gt(session.expiresAt, now))),
  ])

  return { ...users, bannedUsers, unregisteredUsers, ...invites, ...sessions }
}

export async function fetchTopInviters(limit: number, audience: Audience = 'admin'): Promise<InviterRank[]> {
  const invitee = alias(user, 'invitee')

  return db
    .select({ name: user.name, username: user.username, count: count(invitee.id) })
    .from(invitee)
    .innerJoin(user, eq(invitee.invitedBy, user.id))
    .where(getVisibleUserFilter(audience))
    .groupBy(user.id)
    .orderBy(desc(count(invitee.id)))
    .limit(limit)
}

const activityUserFields = { name: user.name, username: user.username, image: user.image }

export async function fetchRecentLogins(limit: number, audience: Audience = 'admin'): Promise<ActivityUser[]> {
  return db
    .select({ ...activityUserFields, time: session.createdAt })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(getVisibleUserFilter(audience))
    .orderBy(desc(session.createdAt))
    .limit(limit)
}

export async function fetchRecentUsers(limit: number, audience: Audience = 'admin'): Promise<ActivityUser[]> {
  return db
    .select({ ...activityUserFields, time: user.createdAt })
    .from(user)
    .where(getVisibleUserFilter(audience))
    .orderBy(desc(user.createdAt))
    .limit(limit)
}

export async function fetchRecentRedemptions(limit: number, audience: Audience = 'admin'): Promise<RedeemedInvite[]> {
  if (audience === 'admin') {
    const rows = await db
      .select({ code: inviteCode.code, redeemedAt: inviteCode.redeemedAt, ...activityUserFields })
      .from(inviteCode)
      .leftJoin(user, eq(inviteCode.redeemedBy, user.id))
      .where(isNotNull(inviteCode.redeemedAt))
      .orderBy(desc(inviteCode.redeemedAt))
      .limit(limit)

    return rows.map(({ code, redeemedAt, name, username, image }) => ({
      code: maskInviteCode(code),
      redeemer: name === null ? null : { name, username, image },
      // The filter only matches redeemed codes
      redeemedAt: redeemedAt as Date,
    }))
  }

  const rows = await db
    .select({ code: inviteCode.code, redeemedAt: inviteCode.redeemedAt, ...activityUserFields })
    .from(inviteCode)
    .innerJoin(user, eq(inviteCode.redeemedBy, user.id))
    .where(and(isNotNull(inviteCode.redeemedAt), getVisibleUserFilter(audience)))
    .orderBy(desc(inviteCode.redeemedAt))
    .limit(limit)

  return rows.map(({ code, redeemedAt, name, username, image }) => ({
    code: maskInviteCode(code),
    redeemer: name === null ? null : { name, username, image },
    // The filter only matches redeemed codes
    redeemedAt: redeemedAt as Date,
  }))
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  const [stats, activity] = await Promise.all([
    fetchDashboardStats(),
    fetchDailyActivity(30),
  ])
  return { stats, activity }
}

// Guests and viewer share this copy; it refreshes hourly because every sign-in changes the stats
export async function fetchDashboardSummaryCache(): Promise<DashboardSummary> {
  'use cache: remote'
  cacheTag('viewer', 'guest')
  cacheLife('hours')

  return fetchDashboardSummary()
}

export async function fetchDashboardDetails(audience: Audience = 'admin'): Promise<DashboardDetails> {
  const [inviters, recentLogins, recentUsers, recentRedemptions] = await Promise.all([
    fetchTopInviters(5, audience),
    fetchRecentLogins(5, audience),
    fetchRecentUsers(5, audience),
    fetchRecentRedemptions(5, audience),
  ])

  return { inviters, recentLogins, recentUsers, recentRedemptions }
}

// Non-admins read cached details filtered by what their role allows
export async function fetchDashboardDetailsCache(audience: PublicAudience): Promise<DashboardDetails> {
  'use cache: remote'
  cacheTag(audience)
  cacheLife('hours')

  return fetchDashboardDetails(audience)
}
