import type { Role } from '@workspace/server/auth/access'

// Both apps run on localhost in development and cookies ignore ports, so the dashboard needs its own prefix
export const authCookiePrefix = 'kreads-dashboard'

export const dashboardRoles: Role[] = ['admin', 'viewer']
