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

export type UserActionType = 'ban' | 'unban' | 'revoke' | 'remove'
