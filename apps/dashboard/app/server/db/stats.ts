import { db } from '@workspace/server/db/client'
import { session, user } from '@workspace/server/db/schema/auth-schema'
import { inviteCode } from '@workspace/server/db/schema/invite-schema'
import { SECONDS, TIME_ZONE } from '@workspace/ui/configs/constants'
import { formatDateTime } from '@workspace/ui/lib/format'
import { and, count, desc, eq, gt, isNotNull, sql } from 'drizzle-orm'
import { alias } from 'drizzle-orm/pg-core'

import { isGithubAdmin, maskInviteCode } from '@/app/server/db/invites'
import { isGithubUser } from '@/app/server/db/users'

import type { SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'
import type { ActivityUser, DailyActivity, DashboardStats, InviterRank, RedeemedInvite } from '@/app/(pages)/dashboard/types'

import 'server-only'

// Timestamps are stored in UTC; group them by the calendar day of the configured zone.
// The zone is inlined (a config value, never user input) so SELECT and GROUP BY stay the same expression
function dayOf(column: PgColumn): SQL<string> {
  return sql<string>`to_char(${column} at time zone 'UTC' at time zone ${sql.raw(`'${TIME_ZONE}'`)}, 'YYYY-MM-DD')`
}

function getRecentDays(days: number): string[] {
  return Array.from({ length: days }, (_, index) => formatDateTime(Date.now() - (days - 1 - index) * SECONDS.day * 1000, { withTime: false }))
}

export async function fetchDailyActivity(days: number): Promise<DailyActivity[]> {
  const recentDays = getRecentDays(days)
  const since = recentDays[0]
  const registrationDay = dayOf(user.createdAt)
  const redemptionDay = dayOf(inviteCode.redeemedAt)
  const loginDay = dayOf(session.createdAt)

  const [registrations, redemptions, logins] = await Promise.all([
    db.select({ day: registrationDay, count: count() }).from(user).where(and(isGithubUser, sql`${registrationDay} >= ${since}`)).groupBy(registrationDay),
    db.select({ day: redemptionDay, count: count() }).from(inviteCode).where(sql`${redemptionDay} >= ${since}`).groupBy(redemptionDay),
    db.select({ day: loginDay, count: count() }).from(session).innerJoin(user, eq(session.userId, user.id)).where(and(isGithubUser, sql`${loginDay} >= ${since}`)).groupBy(loginDay),
  ])

  const toMap = (rows: { day: string, count: number }[]): Map<string, number> => new Map(rows.map(row => [row.day, row.count]))
  const registrationMap = toMap(registrations)
  const redemptionMap = toMap(redemptions)
  const loginMap = toMap(logins)

  return recentDays.map(day => ({
    date: day.slice(5).replace('-', '/'),
    registrations: registrationMap.get(day) ?? 0,
    redemptions: redemptionMap.get(day) ?? 0,
    logins: loginMap.get(day) ?? 0,
  }))
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [[users], [invites], [sessions]] = await Promise.all([
    db
      .select({
        totalUsers: count(),
        bannedUsers: count(sql`case when ${user.banned} and (${user.banExpires} is null or ${user.banExpires} > now()) then 1 end`),
        unregisteredUsers: count(sql`case when ${user.repoName} is null then 1 end`),
        invitedUsers: count(user.invitedBy),
      })
      .from(user)
      .where(isGithubUser),
    db.select({ totalInvites: count(), redeemedInvites: count(inviteCode.redeemedAt) }).from(inviteCode),
    db
      .select({ activeSessions: count() })
      .from(session)
      .innerJoin(user, eq(session.userId, user.id))
      .where(and(isGithubUser, gt(session.expiresAt, new Date()))),
  ])

  return { ...users, ...invites, ...sessions }
}

export async function fetchTopInviters(limit: number): Promise<InviterRank[]> {
  const invitee = alias(user, 'invitee')

  return db
    .select({ name: user.name, username: user.username, count: count(invitee.id) })
    .from(invitee)
    .innerJoin(user, eq(invitee.invitedBy, user.id))
    .groupBy(user.id)
    .orderBy(desc(count(invitee.id)))
    .limit(limit)
}

const activityUserFields = { name: user.name, username: user.username, image: user.image }

export async function fetchRecentLogins(limit: number): Promise<ActivityUser[]> {
  return db
    .select({ ...activityUserFields, time: session.createdAt })
    .from(session)
    .innerJoin(user, eq(session.userId, user.id))
    .where(isGithubUser)
    .orderBy(desc(session.createdAt))
    .limit(limit)
}

export async function fetchRecentUsers(limit: number): Promise<ActivityUser[]> {
  return db
    .select({ ...activityUserFields, time: user.createdAt })
    .from(user)
    .where(isGithubUser)
    .orderBy(desc(user.createdAt))
    .limit(limit)
}

export async function fetchRecentRedemptions(isAdmin: boolean, limit: number): Promise<RedeemedInvite[]> {
  const rows = await db
    .select({ code: inviteCode.code, redeemedAt: inviteCode.redeemedAt, ...activityUserFields })
    .from(inviteCode)
    .leftJoin(user, eq(inviteCode.redeemedBy, user.id))
    .where(isAdmin ? isNotNull(inviteCode.redeemedAt) : isGithubAdmin)
    .orderBy(desc(inviteCode.redeemedAt))
    .limit(limit)

  return rows.map(({ code, redeemedAt, name, username, image }) => ({
    code: maskInviteCode(code),
    redeemer: name === null ? null : { name, username, image },
    // Both filters only match redeemed codes
    redeemedAt: redeemedAt as Date,
  }))
}
