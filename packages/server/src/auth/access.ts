import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements, userAc } from 'better-auth/plugins/admin/access'

export const ac = createAccessControl(defaultStatements)

// viewer is a public read-only account, so it gets no admin plugin permissions
export const roles = {
  admin: ac.newRole(adminAc.statements),
  user: ac.newRole(userAc.statements),
  viewer: ac.newRole({ user: [], session: [] }),
}

export type Role = keyof typeof roles

export function hasRole(role: string | null | undefined, name: Role): boolean {
  return !!role?.split(',').includes(name)
}
