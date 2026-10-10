import type { RemixiconComponentType } from '@remixicon/react'
import type { StatTrendPoint } from '@/types/stat'

export type LanguageCode = 'zh-TW' | 'en' | 'ja'

export type NotifyMethod = 'email' | 'webhook'

export interface ProfileStat {
  key: string
  icon: RemixiconComponentType
  label: string
  value: string
  description: string
  trend: StatTrendPoint[]
}

export interface ProfileSettings {
  displayName: string
  email: string
  language: LanguageCode
  notifyMethod: NotifyMethod
  quotaWarningThreshold: number
  shouldReceiveAnnouncements: boolean
  shouldNotifyLowQuota: boolean
}
