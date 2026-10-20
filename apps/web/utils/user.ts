import type { AuthSession } from '@workspace/server/auth/options'
import type { UserRepo, ViewerUser } from '@/types/user'

export function isUserActive(session: AuthSession | null) {
  return !!session?.user.repoName
}

export function getRepoName({ owner, repo }: Pick<UserRepo, 'owner' | 'repo'>): string {
  return `${owner}/${repo}`
}

export function getViewerUser(data: Partial<AuthSession['user']>): ViewerUser | null {
  if (!data.username || !data.repoName) return null
  return {
    username: data.username,
    name: data?.name ?? '',
    image: data.image ?? undefined,
    repoName: data.repoName,
  }
}
