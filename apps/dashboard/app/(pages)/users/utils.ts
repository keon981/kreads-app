import type { UserStatus } from './types'

export const userStatusLabels: Record<UserStatus, string> = {
  active: '正常',
  banned: '停權',
}
