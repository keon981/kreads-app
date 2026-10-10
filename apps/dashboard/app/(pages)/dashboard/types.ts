import type { InviteRedeemer } from '@/app/(pages)/invites/types'

export interface DailyActivity {
  /** MM/DD */
  date: string
  registrations: number
  redemptions: number
  logins: number
}

export interface InviterRank {
  name: string
  username: string | null
  count: number
}

export interface ActivityUser extends InviteRedeemer {
  time: Date
}

export interface RedeemedInvite {
  /** Always masked */
  code: string
  redeemer: InviteRedeemer | null
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
