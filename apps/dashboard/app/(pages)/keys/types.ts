export type TokenStatus = 'enabled' | 'disabled' | 'expired' | 'exhausted'

export type TokenStatusFilter = TokenStatus | 'all'

export interface Token {
  id: string
  name: string
  key: string
  status: TokenStatus
  usedQuota: number
  /** `null` means unlimited quota */
  totalQuota: number | null
  group: string
  createdAt: string
  /** `null` means the token never expires */
  expiresAt: string | null
  models: string[]
  allowIps: string[]
}

export interface TokenFormValues {
  name: string
  totalQuota: number
  isUnlimited: boolean
  expiresAt: string
  isNeverExpires: boolean
  group: string
  models: string
  allowIps: string
}

export interface TokenFilterValues {
  name: string
  key: string
  status: TokenStatusFilter
}
