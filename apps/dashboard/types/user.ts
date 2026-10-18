import * as z from 'zod'

import type { AuthSession } from '@workspace/server/auth/options'
import type { PublicAudience } from '@workspace/server/types/revalidate'

export type SessionUser = AuthSession['user']

// guest is a signed-out visitor
export type Audience = 'admin' | PublicAudience

export type UserStatus = 'active' | 'banned'

export type UserStatusFilter = UserStatus | 'all'

export const AssignableRoleSchema = z.enum(['user', 'admin'])

export type AssignableRole = z.infer<typeof AssignableRoleSchema>

export type AssignableRoleFilter = AssignableRole | 'all'

export interface ViewerUser {
  name: string
  username?: string | null
  image?: string | null
}

export interface UserRow extends ViewerUser {
  id?: string //  Admin only
  email?: string //  Admin only
  isPublic?: boolean //  Admin only
  role: AssignableRole
  status: UserStatus
  createdAt: Date
}

export const UserActionTypeSchema = z.enum(['ban', 'unban', 'revoke', 'remove'])

export type UserActionType = z.infer<typeof UserActionTypeSchema>
