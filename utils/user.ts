import type { AuthSession } from '@/types/auth'

export function isUserActive(session: AuthSession) {
  if (!session.user.repoName || session.user.status === 'pending') return false
  return true
}
