import type { AuthSession } from '@workspace/server/auth/options'

export type VerifiedSession
  = | { status: 'signed-out', session: null }
    | { status: 'unregistered' | 'active', session: AuthSession }

export interface AuthUser {
  id?: string
  name?: string | null
  image?: string
  repoName?: string
  isPublic: boolean
}
