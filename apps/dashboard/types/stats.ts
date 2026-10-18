import type { ViewerUser } from './user'

export interface DailyActivity {
  /** MM/DD */
  date: string
  registrations: number
  redemptions: number
  logins: number
}

export interface InviterRank extends ViewerUser {
  count: number
}

export interface ActivityUser extends ViewerUser {
  time: Date
}

export interface RedeemedInvite {
  /** Always masked */
  code: string
  redeemer: ViewerUser | null
  redeemedAt: Date
}

export interface DashboardStats {
  totalUsers: number
  bannedUsers: number
  unregisteredUsers: number
  invitedUsers: number
  totalInvites: number
  redeemedInvites: number
  activeSessions: number
}

export interface DashboardSummary {
  stats: DashboardStats
  activity: DailyActivity[]
}

export interface DashboardDetails {
  inviters: InviterRank[]
  recentLogins: ActivityUser[]
  recentUsers: ActivityUser[]
  recentRedemptions: RedeemedInvite[]
}

export type DashboardData = DashboardSummary & DashboardDetails
