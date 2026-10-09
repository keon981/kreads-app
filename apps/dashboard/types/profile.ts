import type { StatTrendPoint } from '@/components/blocks/stat-card'

export type ProfileStatKey = 'balance' | 'usedQuota' | 'requestCount'

export type LanguageCode = 'zh-TW' | 'en' | 'ja'

export type NotifyMethod = 'email' | 'webhook'

export interface ProfileStat {
  readonly key: ProfileStatKey
  readonly label: string
  readonly value: string
  readonly description: string
  readonly trend: readonly StatTrendPoint[]
}

export interface SelectOption<TValue extends string> {
  readonly value: TValue
  readonly label: string
}

export interface ProfileSettings {
  readonly displayName: string
  readonly email: string
  readonly language: LanguageCode
  readonly notifyMethod: NotifyMethod
  readonly quotaWarningThreshold: number
  readonly receiveAnnouncements: boolean
  readonly notifyLowQuota: boolean
}
