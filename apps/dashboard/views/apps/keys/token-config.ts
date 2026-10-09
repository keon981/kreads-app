import type { OptionItem, TokenFilterValues, TokenFormValues, TokenStatus, TokenStatusFilter } from '@/types/keys'

interface TokenStatusMeta {
  readonly label: string
  readonly className: string
}

export const TOKEN_STATUS_META: Readonly<Record<TokenStatus, TokenStatusMeta>> = {
  enabled: {
    label: '啟用',
    className: 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400',
  },
  disabled: {
    label: '停用',
    className: 'bg-muted text-muted-foreground',
  },
  expired: {
    label: '已過期',
    className: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  },
  exhausted: {
    label: '已耗盡',
    className: 'bg-destructive/10 text-destructive dark:bg-destructive/20',
  },
} as const

export const TOKEN_STATUS_OPTIONS: readonly OptionItem<TokenStatusFilter>[] = [
  { label: '全部狀態', value: 'all' },
  { label: TOKEN_STATUS_META.enabled.label, value: 'enabled' },
  { label: TOKEN_STATUS_META.disabled.label, value: 'disabled' },
  { label: TOKEN_STATUS_META.expired.label, value: 'expired' },
  { label: TOKEN_STATUS_META.exhausted.label, value: 'exhausted' },
] as const

export const PAGE_SIZE_OPTIONS: readonly OptionItem<number>[] = [
  { label: '10 筆／頁', value: 10 },
  { label: '20 筆／頁', value: 20 },
  { label: '50 筆／頁', value: 50 },
] as const

export const DEFAULT_TOKEN_FILTERS: TokenFilterValues = {
  name: '',
  key: '',
  status: 'all',
} as const

export const DEFAULT_TOKEN_FORM_VALUES: TokenFormValues = {
  name: '',
  totalQuota: 10,
  isUnlimited: false,
  expiresAt: '',
  isNeverExpires: true,
  group: 'default',
  models: '',
  allowIps: '',
} as const
