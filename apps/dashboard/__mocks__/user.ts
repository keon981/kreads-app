import type { CurrentUser } from '@/types/user'

export const currentUser: CurrentUser = {
  id: 1024,
  username: 'keon',
  displayName: 'Keon',
  email: 'keon@example.com',
  role: '管理員',
  group: 'default',
} as const
