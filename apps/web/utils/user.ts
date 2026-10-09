import type { AuthSession } from '@/types/auth'
import type { ViewerUser } from '@/types/user'

export function isUserActive(session: AuthSession | null) {
  return !!session?.user.repoName
}

export function isAdminRole(role: string | null | undefined): boolean {
  return !!role?.split(',').includes('admin')
}

export function getViewerUser(data: Partial<AuthSession['user']>): ViewerUser | null {
  if (!data.username || !data.repoName) return null
  return {
    username: data.username,
    name: data?.name ?? '',
    avatarUrl: data.image ?? undefined,
    repoName: data.repoName,
  }
}
