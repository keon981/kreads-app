import type { RemixiconComponentType } from '@remixicon/react'
import type { StatTrendPoint } from '@/components/blocks/stat-card'

export interface StatMetric {
  readonly id: string
  readonly label: string
  readonly value: string
  readonly description: string
  readonly icon: RemixiconComponentType
  readonly trend: readonly StatTrendPoint[]
}

export interface StatGroup {
  readonly id: string
  readonly title: string
  readonly metrics: readonly StatMetric[]
}

export type ModelKey = 'gpt4o' | 'claudeSonnet' | 'geminiPro' | 'deepseekChat'

export interface ModelInfo {
  readonly key: ModelKey
  readonly name: string
  readonly color: string
}

export interface DailyModelConsumption {
  readonly date: string
  readonly gpt4o: number
  readonly claudeSonnet: number
  readonly geminiPro: number
  readonly deepseekChat: number
}

export interface ModelCallCount {
  readonly model: ModelKey
  readonly calls: number
  readonly fill: string
}

export type LatencyLevel = 'fast' | 'normal' | 'slow'

export interface ApiEndpoint {
  readonly id: string
  readonly name: string
  readonly url: string
  readonly latencyMs: number
  readonly latencyLevel: LatencyLevel
}

export type AnnouncementType = 'info' | 'update' | 'maintenance'

export interface Announcement {
  readonly id: string
  readonly title: string
  readonly content: string
  readonly date: string
  readonly type: AnnouncementType
}

export interface FaqItem {
  readonly id: string
  readonly question: string
  readonly answer: string
}

export type ServiceHealth = 'operational' | 'degraded' | 'outage'

export interface ServiceStatus {
  readonly id: string
  readonly name: string
  readonly status: ServiceHealth
  readonly uptime: string
  readonly history: readonly ServiceHealth[]
}
