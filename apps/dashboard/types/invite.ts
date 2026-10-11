import type { ActionState } from '@workspace/server/types/action'
import type { AssignableRole } from '@/types/user'

export type InviteStatus = 'unused' | 'redeemed'

export type InviteStatusFilter = InviteStatus | 'all'

export interface InviteRedeemer {
  name: string
  username: string | null
  image: string | null
}

export interface InviteRow {
  /** Admin only */
  id?: string
  /** Masked for viewer */
  code: string
  role: AssignableRole
  status: InviteStatus
  /** `null` with a redeemed status means the redeemer was deleted */
  redeemer: InviteRedeemer | null
  createdAt: Date
  redeemedAt: Date | null
}

export interface DeleteInvitesState extends ActionState {
  count?: number
}
