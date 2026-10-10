import {
  RiBarChartBoxLine,
  RiCoinsLine,
  RiExchangeDollarLine,
  RiFlashlightLine,
  RiPulseLine,
  RiSendPlaneLine,
  RiSpeedUpLine,
  RiWallet3Line,
} from '@remixicon/react'

import type {
  Announcement,
  ApiEndpoint,
  DailyModelConsumption,
  FaqItem,
  ModelCallCount,
  ModelInfo,
  ServiceHealth,
  ServiceStatus,
  StatGroup,
} from '@/app/(pages)/dashboard/types'

export const statGroups: StatGroup[] = [
  {
    id: 'account',
    title: '帳戶數據',
    metrics: [
      {
        id: 'balance',
        label: '目前餘額',
        value: '$248.62',
        description: '約可使用 18 天',
        icon: RiWallet3Line,
        trend: [{ value: 320 }, { value: 305 }, { value: 298 }, { value: 284 }, { value: 270 }, { value: 262 }, { value: 249 }],
      },
      {
        id: 'used',
        label: '歷史消耗',
        value: '$1,375.40',
        description: '本月 +$86.20',
        icon: RiExchangeDollarLine,
        trend: [{ value: 1210 }, { value: 1238 }, { value: 1262 }, { value: 1290 }, { value: 1318 }, { value: 1349 }, { value: 1375 }],
      },
    ],
  },
  {
    id: 'usage',
    title: '使用統計',
    metrics: [
      {
        id: 'requests',
        label: '請求次數',
        value: '128,450',
        description: '較上週 +12.4%',
        icon: RiSendPlaneLine,
        trend: [{ value: 15200 }, { value: 16800 }, { value: 16100 }, { value: 18400 }, { value: 19300 }, { value: 20100 }, { value: 22550 }],
      },
      {
        id: 'statCount',
        label: '統計次數',
        value: '9,832',
        description: '近 7 天',
        icon: RiBarChartBoxLine,
        trend: [{ value: 1180 }, { value: 1320 }, { value: 1260 }, { value: 1410 }, { value: 1490 }, { value: 1520 }, { value: 1652 }],
      },
    ],
  },
  {
    id: 'resource',
    title: '資源消耗',
    metrics: [
      {
        id: 'quota',
        label: '統計額度',
        value: '$86.20',
        description: '近 7 天',
        icon: RiCoinsLine,
        trend: [{ value: 9.8 }, { value: 11.2 }, { value: 10.6 }, { value: 12.9 }, { value: 13.4 }, { value: 12.1 }, { value: 16.2 }],
      },
      {
        id: 'tokens',
        label: '統計 Tokens',
        value: '42.6M',
        description: '輸入 31.2M ／ 輸出 11.4M',
        icon: RiFlashlightLine,
        trend: [{ value: 4.9 }, { value: 5.4 }, { value: 5.1 }, { value: 6.2 }, { value: 6.5 }, { value: 6.3 }, { value: 8.2 }],
      },
    ],
  },
  {
    id: 'performance',
    title: '性能指標',
    metrics: [
      {
        id: 'rpm',
        label: '平均 RPM',
        value: '89.2',
        description: '峰值 214',
        icon: RiPulseLine,
        trend: [{ value: 72 }, { value: 81 }, { value: 78 }, { value: 86 }, { value: 92 }, { value: 88 }, { value: 89 }],
      },
      {
        id: 'tpm',
        label: '平均 TPM',
        value: '29,580',
        description: '峰值 71,200',
        icon: RiSpeedUpLine,
        trend: [{ value: 24100 }, { value: 26800 }, { value: 25300 }, { value: 28900 }, { value: 30200 }, { value: 29100 }, { value: 29580 }],
      },
    ],
  },
]

export const models: ModelInfo[] = [
  { key: 'gpt4o', name: 'gpt-4o', color: 'var(--chart-2)' },
  { key: 'claudeSonnet', name: 'claude-sonnet', color: 'var(--chart-4)' },
  { key: 'geminiPro', name: 'gemini-pro', color: 'var(--chart-1)' },
  { key: 'deepseekChat', name: 'deepseek-chat', color: 'var(--chart-3)' },
]

export const dailyModelConsumption: DailyModelConsumption[] = [
  { date: '10/04', gpt4o: 4.2, claudeSonnet: 3.1, geminiPro: 1.4, deepseekChat: 1.1 },
  { date: '10/05', gpt4o: 4.8, claudeSonnet: 3.6, geminiPro: 1.6, deepseekChat: 1.2 },
  { date: '10/06', gpt4o: 4.1, claudeSonnet: 3.9, geminiPro: 1.5, deepseekChat: 1.1 },
  { date: '10/07', gpt4o: 5.3, claudeSonnet: 4.2, geminiPro: 2.0, deepseekChat: 1.4 },
  { date: '10/08', gpt4o: 5.6, claudeSonnet: 4.4, geminiPro: 1.9, deepseekChat: 1.5 },
  { date: '10/09', gpt4o: 4.9, claudeSonnet: 4.0, geminiPro: 1.8, deepseekChat: 1.4 },
  { date: '10/10', gpt4o: 6.4, claudeSonnet: 5.1, geminiPro: 2.6, deepseekChat: 2.1 },
]

export const modelCallCounts: ModelCallCount[] = [
  { model: 'gpt4o', calls: 48210, fill: 'var(--color-gpt4o)' },
  { model: 'claudeSonnet', calls: 39580, fill: 'var(--color-claudeSonnet)' },
  { model: 'geminiPro', calls: 22340, fill: 'var(--color-geminiPro)' },
  { model: 'deepseekChat', calls: 18320, fill: 'var(--color-deepseekChat)' },
]

export const apiEndpoints: ApiEndpoint[] = [
  { id: 'primary', name: '主要線路', url: 'https://api.kreads.dev/v1', latencyMs: 42, latencyLevel: 'fast' },
  { id: 'asia', name: '亞洲加速', url: 'https://asia.api.kreads.dev/v1', latencyMs: 118, latencyLevel: 'normal' },
  { id: 'backup', name: '備用線路', url: 'https://backup.api.kreads.dev/v1', latencyMs: 286, latencyLevel: 'slow' },
]

export const announcements: Announcement[] = [
  {
    id: 'claude-sonnet',
    title: '新增 claude-sonnet 模型',
    content: '已開放所有分組使用，計費倍率與官方一致。',
    date: '2026-10-08',
    type: 'update',
  },
  {
    id: 'maintenance',
    title: '10/12 凌晨例行維護',
    content: '02:00–03:00 備用線路暫停服務，主要線路不受影響。',
    date: '2026-10-06',
    type: 'maintenance',
  },
  {
    id: 'pricing',
    title: 'gemini-pro 價格調降',
    content: '輸入 Tokens 單價調降 20%，即日起生效。',
    date: '2026-10-01',
    type: 'info',
  },
]

export const faqItems: FaqItem[] = [
  {
    id: 'balance',
    question: '餘額不足時會發生什麼事？',
    answer: '餘額低於 0 時，所有令牌的請求都會回傳 403，儲值後會立即恢復。',
  },
  {
    id: 'quota',
    question: '統計額度怎麼計算？',
    answer: '依各模型的計費倍率，將輸入與輸出 Tokens 換算成美元額度後加總。',
  },
  {
    id: 'endpoint',
    question: '該使用哪一條 API 線路？',
    answer: '建議優先使用延遲最低的線路；若遇到連線問題，可改用備用線路。',
  },
  {
    id: 'rate-limit',
    question: '請求被限流怎麼辦？',
    answer: '可在令牌管理中調整單一令牌的 RPM 上限，或聯繫管理員提高分組配額。',
  },
]

function getServiceHistory(degradedDays: number[], outageDays: number[] = []): ServiceHealth[] {
  return Array.from({ length: 30 }, (_, index): ServiceHealth => {
    if (outageDays.includes(index))
      return 'outage'
    if (degradedDays.includes(index))
      return 'degraded'
    return 'operational'
  })
}

export const serviceStatuses: ServiceStatus[] = [
  { id: 'api', name: 'API 閘道', status: 'operational', uptime: '99.98%', history: getServiceHistory([12]) },
  { id: 'openai', name: 'OpenAI 上游', status: 'operational', uptime: '99.91%', history: getServiceHistory([4, 21]) },
  { id: 'anthropic', name: 'Anthropic 上游', status: 'degraded', uptime: '99.42%', history: getServiceHistory([17, 28, 29], [9]) },
  { id: 'google', name: 'Google 上游', status: 'operational', uptime: '100%', history: getServiceHistory([]) },
]
