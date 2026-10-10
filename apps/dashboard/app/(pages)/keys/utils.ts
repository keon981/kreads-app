import type { Token, TokenFormValues, TokenStatus } from './types'

export const tokenStatusLabels: Record<TokenStatus, string> = {
  enabled: '啟用',
  disabled: '停用',
  expired: '已過期',
  exhausted: '已耗盡',
}

const defaultTokenFormValues: TokenFormValues = {
  name: '',
  totalQuota: 10,
  isUnlimited: false,
  expiresAt: '',
  isNeverExpires: true,
  group: 'default',
  models: '',
  allowIps: '',
}

export function formatQuota(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

export function getMaskedKey(key: string): string {
  const prefixLength = 'sk-'.length + 4
  return `${key.slice(0, prefixLength)}…${key.slice(-4)}`
}

export function getQuotaPercent(token: Token): number {
  if (token.totalQuota === null || token.totalQuota === 0) {
    return 0
  }
  return Math.min(100, Math.round((token.usedQuota / token.totalQuota) * 100))
}

function splitLines(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map(item => item.trim())
    .filter(Boolean)
}

export function getTokenFormValues(token: Token | null): TokenFormValues {
  if (!token) {
    return defaultTokenFormValues
  }

  return {
    name: token.name,
    totalQuota: token.totalQuota ?? defaultTokenFormValues.totalQuota,
    isUnlimited: token.totalQuota === null,
    expiresAt: token.expiresAt?.slice(0, 10) ?? '',
    isNeverExpires: token.expiresAt === null,
    group: token.group,
    models: token.models.join('\n'),
    allowIps: token.allowIps.join('\n'),
  }
}

interface TokenDraft {
  id: string
  key: string
  createdAt: string
}

export function getTokenFromFormValues(values: TokenFormValues, base: Token | TokenDraft): Token {
  const totalQuota = values.isUnlimited ? null : values.totalQuota
  const usedQuota = 'usedQuota' in base ? base.usedQuota : 0
  const status = 'status' in base ? base.status : 'enabled'

  return {
    id: base.id,
    key: base.key,
    createdAt: base.createdAt,
    name: values.name.trim() || '未命名令牌',
    status,
    usedQuota,
    totalQuota,
    group: values.group,
    expiresAt: values.isNeverExpires || !values.expiresAt
      ? null
      : `${values.expiresAt}T15:59:59.000Z`,
    models: splitLines(values.models),
    allowIps: splitLines(values.allowIps),
  }
}

// Called only from client event handlers, never during render
export function getNewTokenDraft(): TokenDraft {
  const randomPart = crypto.randomUUID().replaceAll('-', '')
  return {
    id: `token-${randomPart.slice(0, 8)}`,
    key: `sk-${randomPart}${randomPart.slice(0, 16)}`,
    createdAt: new Date().toISOString(),
  }
}
