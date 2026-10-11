import type { Role } from '@workspace/server/auth/access'

export type InviteCodeStatus = 'valid' | 'invalid' | 'limit'

export type RedeemResult
  = | { status: 'valid', invitedBy: string | null, role: Role }
    | { status: Exclude<InviteCodeStatus, 'valid'> }
