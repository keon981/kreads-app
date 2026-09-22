import type { AuthSession } from '@/types/auth'

export function isUserActive(session: AuthSession | null) {
  return !!session?.user.repoName
}
