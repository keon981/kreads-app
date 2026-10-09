import { currentUser } from '@/__mocks__/user'

import type { LanguageCode, NotifyMethod, ProfileSettings, ProfileStat, SelectOption } from '@/types/profile'

export const profileStats: readonly ProfileStat[] = [
  {
    key: 'balance',
    label: '目前餘額',
    value: '$1,280.50',
    description: '近 7 天 -21%',
    trend: [{ value: 1620 }, { value: 1544 }, { value: 1498 }, { value: 1452 }, { value: 1390 }, { value: 1336 }, { value: 1280 }],
  },
  {
    key: 'usedQuota',
    label: '已用額度',
    value: '$342.18',
    description: '本月較上月 +12.4%',
    trend: [{ value: 180 }, { value: 204 }, { value: 236 }, { value: 251 }, { value: 288 }, { value: 310 }, { value: 342 }],
  },
  {
    key: 'requestCount',
    label: '請求次數',
    value: '18,452',
    description: '近 30 天累計',
    trend: [{ value: 2210 }, { value: 2480 }, { value: 2390 }, { value: 2760 }, { value: 2650 }, { value: 2940 }, { value: 3022 }],
  },
] as const

export const profileSettings: ProfileSettings = {
  displayName: currentUser.displayName,
  email: currentUser.email,
  language: 'zh-TW',
  notifyMethod: 'email',
  quotaWarningThreshold: 50,
  receiveAnnouncements: true,
  notifyLowQuota: true,
} as const

export const languageOptions: readonly SelectOption<LanguageCode>[] = [
  { value: 'zh-TW', label: '繁體中文' },
  { value: 'en', label: 'English' },
  { value: 'ja', label: '日本語' },
] as const

export const notifyMethodOptions: readonly SelectOption<NotifyMethod>[] = [
  { value: 'email', label: '電子郵件' },
  { value: 'webhook', label: 'Webhook' },
] as const
