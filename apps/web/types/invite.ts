export type InviteCodeStatus = 'valid' | 'invalid' | 'limit'

export type RedeemResult
  = | { status: 'valid', invitedBy: string | null }
    | { status: Exclude<InviteCodeStatus, 'valid'> }
