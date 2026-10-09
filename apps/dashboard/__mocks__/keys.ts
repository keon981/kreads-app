import type { OptionItem, Token, TokenStatus } from '@/types/keys'

export const tokenGroups: readonly OptionItem[] = [
  { label: '預設分組', value: 'default' },
  { label: 'VIP', value: 'vip' },
  { label: 'SVIP', value: 'svip' },
  { label: '內部測試', value: 'internal' },
] as const

export const tokenModels = [
  'gpt-4o',
  'gpt-4o-mini',
  'claude-sonnet-4',
  'gemini-2.5-pro',
  'deepseek-v3',
] as const

interface TokenSeed {
  readonly name: string
  readonly status: TokenStatus
  readonly totalQuota: number | null
  readonly usedRatio: number
  readonly group: string
  readonly createdAt: string
  readonly expiresAt: string | null
}

const tokenSeeds: readonly TokenSeed[] = [
  { name: '正式環境主令牌', status: 'enabled', totalQuota: 500, usedRatio: 0.42, group: 'svip', createdAt: '2026-01-05T02:14:00.000Z', expiresAt: null },
  { name: '測試環境', status: 'enabled', totalQuota: 50, usedRatio: 0.18, group: 'internal', createdAt: '2026-01-12T08:30:00.000Z', expiresAt: '2026-12-31T15:59:59.000Z' },
  { name: '客服機器人', status: 'enabled', totalQuota: null, usedRatio: 0, group: 'vip', createdAt: '2026-01-20T03:45:00.000Z', expiresAt: null },
  { name: '翻譯服務', status: 'exhausted', totalQuota: 100, usedRatio: 1, group: 'default', createdAt: '2026-02-01T06:10:00.000Z', expiresAt: '2027-02-01T00:00:00.000Z' },
  { name: '資料標註腳本', status: 'disabled', totalQuota: 30, usedRatio: 0.65, group: 'default', createdAt: '2026-02-08T11:22:00.000Z', expiresAt: null },
  { name: '行銷文案產生器', status: 'enabled', totalQuota: 200, usedRatio: 0.73, group: 'vip', createdAt: '2026-02-14T09:00:00.000Z', expiresAt: '2026-11-30T15:59:59.000Z' },
  { name: '舊版 API 相容', status: 'expired', totalQuota: 80, usedRatio: 0.55, group: 'default', createdAt: '2025-08-03T04:05:00.000Z', expiresAt: '2026-03-01T00:00:00.000Z' },
  { name: '程式碼審查助手', status: 'enabled', totalQuota: 150, usedRatio: 0.31, group: 'svip', createdAt: '2026-03-02T07:40:00.000Z', expiresAt: null },
  { name: '摘要服務', status: 'enabled', totalQuota: null, usedRatio: 0, group: 'svip', createdAt: '2026-03-10T10:15:00.000Z', expiresAt: '2027-03-10T00:00:00.000Z' },
  { name: '前端開發用', status: 'enabled', totalQuota: 20, usedRatio: 0.92, group: 'internal', createdAt: '2026-03-18T13:50:00.000Z', expiresAt: null },
  { name: '夜間批次任務', status: 'disabled', totalQuota: 300, usedRatio: 0.12, group: 'vip', createdAt: '2026-03-25T16:20:00.000Z', expiresAt: '2026-12-01T00:00:00.000Z' },
  { name: '語音轉文字', status: 'enabled', totalQuota: 120, usedRatio: 0.47, group: 'default', createdAt: '2026-04-02T01:35:00.000Z', expiresAt: null },
  { name: '試用帳號 A', status: 'expired', totalQuota: 10, usedRatio: 0.4, group: 'default', createdAt: '2026-04-06T05:05:00.000Z', expiresAt: '2026-05-06T00:00:00.000Z' },
  { name: '試用帳號 B', status: 'exhausted', totalQuota: 10, usedRatio: 1, group: 'default', createdAt: '2026-04-06T05:06:00.000Z', expiresAt: '2026-12-06T00:00:00.000Z' },
  { name: '知識庫問答', status: 'enabled', totalQuota: 400, usedRatio: 0.58, group: 'svip', createdAt: '2026-04-15T08:45:00.000Z', expiresAt: null },
  { name: '圖片描述', status: 'enabled', totalQuota: 60, usedRatio: 0.09, group: 'vip', createdAt: '2026-04-22T12:00:00.000Z', expiresAt: '2027-01-15T00:00:00.000Z' },
  { name: 'Discord Bot', status: 'enabled', totalQuota: null, usedRatio: 0, group: 'default', createdAt: '2026-05-01T09:30:00.000Z', expiresAt: null },
  { name: 'Slack 整合', status: 'disabled', totalQuota: 90, usedRatio: 0.21, group: 'vip', createdAt: '2026-05-09T03:10:00.000Z', expiresAt: null },
  { name: '報表分析', status: 'enabled', totalQuota: 250, usedRatio: 0.36, group: 'svip', createdAt: '2026-05-17T07:25:00.000Z', expiresAt: '2026-12-31T15:59:59.000Z' },
  { name: '郵件分類', status: 'enabled', totalQuota: 40, usedRatio: 0.83, group: 'default', createdAt: '2026-05-28T14:55:00.000Z', expiresAt: null },
  { name: '合作夥伴 X', status: 'expired', totalQuota: 500, usedRatio: 0.67, group: 'svip', createdAt: '2025-11-11T02:00:00.000Z', expiresAt: '2026-06-30T00:00:00.000Z' },
  { name: '合作夥伴 Y', status: 'enabled', totalQuota: 500, usedRatio: 0.24, group: 'svip', createdAt: '2026-06-05T02:00:00.000Z', expiresAt: '2027-06-05T00:00:00.000Z' },
  { name: '內部 Playground', status: 'enabled', totalQuota: null, usedRatio: 0, group: 'internal', createdAt: '2026-06-14T10:40:00.000Z', expiresAt: null },
  { name: 'SEO 文章', status: 'exhausted', totalQuota: 75, usedRatio: 1, group: 'vip', createdAt: '2026-06-23T06:18:00.000Z', expiresAt: null },
  { name: '自動化測試', status: 'enabled', totalQuota: 35, usedRatio: 0.5, group: 'internal', createdAt: '2026-07-02T11:11:00.000Z', expiresAt: null },
  { name: '行動 App', status: 'enabled', totalQuota: 180, usedRatio: 0.14, group: 'vip', createdAt: '2026-07-19T04:44:00.000Z', expiresAt: '2027-07-19T00:00:00.000Z' },
  { name: '研究實驗', status: 'disabled', totalQuota: null, usedRatio: 0, group: 'internal', createdAt: '2026-08-08T08:08:00.000Z', expiresAt: null },
  { name: '電商客服', status: 'enabled', totalQuota: 320, usedRatio: 0.61, group: 'svip', createdAt: '2026-08-21T15:30:00.000Z', expiresAt: null },
  { name: '工作坊示範', status: 'expired', totalQuota: 15, usedRatio: 0.2, group: 'default', createdAt: '2026-09-01T01:00:00.000Z', expiresAt: '2026-09-30T00:00:00.000Z' },
  { name: '新專案 Alpha', status: 'enabled', totalQuota: 100, usedRatio: 0.03, group: 'default', createdAt: '2026-09-28T09:20:00.000Z', expiresAt: null },
]

const KEY_CHARSET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const KEY_LENGTH = 48

// Deterministic pseudo-random key so server and client renders match
function getMockKey(seed: number): string {
  let state = seed * 9301 + 49297
  let key = 'sk-'

  for (let index = 0; index < KEY_LENGTH; index += 1) {
    state = (state * 9301 + 49297) % 233280
    key += KEY_CHARSET[state % KEY_CHARSET.length]
  }

  return key
}

function getMockModels(index: number): readonly string[] {
  if (index % 3 === 0) {
    return []
  }

  return tokenModels.filter((_, modelIndex) => (modelIndex + index) % 2 === 0)
}

export const tokens: readonly Token[] = tokenSeeds.map((seed, index) => ({
  id: `token-${String(index + 1).padStart(3, '0')}`,
  name: seed.name,
  key: getMockKey(index + 1),
  status: seed.status,
  usedQuota: seed.totalQuota === null
    ? Math.round((index + 1) * 13.37 * 100) / 100
    : Math.round(seed.totalQuota * seed.usedRatio * 100) / 100,
  totalQuota: seed.totalQuota,
  group: seed.group,
  createdAt: seed.createdAt,
  expiresAt: seed.expiresAt,
  models: getMockModels(index),
  allowIps: index % 4 === 0 ? ['203.0.113.10', '198.51.100.0/24'] : [],
}))
