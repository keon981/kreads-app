import type { AuthSession } from '@workspace/server/auth/options'

export type VerifiedSession
  = | { status: 'signed-out', session: null }
    | { status: 'unregistered' | 'active', session: AuthSession }
