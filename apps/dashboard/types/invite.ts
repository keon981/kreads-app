import type { ActionState } from '@workspace/server/types/action'
import type { AssignableRole, ViewerUser } from '@/types/user'

export type InviteStatus = 'unused' | 'redeemed'

export type InviteStatusFilter = InviteStatus | 'all'

export interface InviteRow {
  id?: string // Admin only
  /** Masked for viewer */
  code: string
  role: AssignableRole
  status: InviteStatus
  /** `null` with a redeemed status means the redeemer was deleted */
  redeemer: ViewerUser | null
  createdAt: Date
  redeemedAt: Date | null
}

export interface DeleteInvitesState extends ActionState {
  count?: number
}
