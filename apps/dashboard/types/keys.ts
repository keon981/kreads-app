export type TokenStatus = 'enabled' | 'disabled' | 'expired' | 'exhausted'

export type TokenStatusFilter = TokenStatus | 'all'

export interface Token {
  readonly id: string
  readonly name: string
  readonly key: string
  readonly status: TokenStatus
  readonly usedQuota: number
  /** `null` means unlimited quota */
  readonly totalQuota: number | null
  readonly group: string
  readonly createdAt: string
  /** `null` means the token never expires */
  readonly expiresAt: string | null
  readonly models: readonly string[]
  readonly allowIps: readonly string[]
}

export interface TokenFormValues {
  readonly name: string
  readonly totalQuota: number
  readonly isUnlimited: boolean
  readonly expiresAt: string
  readonly isNeverExpires: boolean
  readonly group: string
  readonly models: string
  readonly allowIps: string
}

export interface TokenFilterValues {
  readonly name: string
  readonly key: string
  readonly status: TokenStatusFilter
}

export interface OptionItem<TValue extends string | number = string> {
  readonly label: string
  readonly value: TValue
}
