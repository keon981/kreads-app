import * as z from 'zod'

import type { AuthSession } from '@workspace/server/auth/options'

export type SessionUser = AuthSession['user']

export type UserStatus = 'active' | 'banned'

export type UserStatusFilter = UserStatus | 'all'

export interface UserRow {
  /** Admin only */
  id?: string
  /** Admin only */
  email?: string
  name: string
  username: string | null
  image: string | null
  status: UserStatus
  createdAt: Date
}

export interface UserFilterValues {
  name: string
  username: string
  status: UserStatusFilter
}

export const UserActionTypeSchema = z.enum(['ban', 'unban', 'revoke', 'remove'])

export type UserActionType = z.infer<typeof UserActionTypeSchema>
