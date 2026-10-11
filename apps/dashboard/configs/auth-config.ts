import type { Role } from '@workspace/server/auth/access'
import type { OptionItem } from '@/types/option'
import type { AssignableRole } from '@/types/user'

// Both apps run on localhost in development and cookies ignore ports, so the dashboard needs its own prefix
export const authCookiePrefix = 'kreads-dashboard'

export const dashboardRoles: Role[] = ['admin', 'viewer']

export const minPasswordLength = 6

// Ordered from lowest to highest privilege
export const roleOptions: OptionItem<AssignableRole>[] = [
  { label: 'user', value: 'user', description: '低下物種' },
  { label: 'admin', value: 'admin', description: '五老星' },
]

export const defaultRole: AssignableRole = roleOptions[0].value
