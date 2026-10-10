import type { RemixiconComponentType } from '@remixicon/react'
import type { StatTrendPoint } from '@/types/stat'

export interface StatMetric {
  id: string
  label: string
  value: string
  description: string
  icon: RemixiconComponentType
  trend: StatTrendPoint[]
}

export interface StatGroup {
  id: string
  title: string
  metrics: StatMetric[]
}

export type ModelKey = 'gpt4o' | 'claudeSonnet' | 'geminiPro' | 'deepseekChat'

export interface ModelInfo {
  key: ModelKey
  name: string
  color: string
}

export interface DailyModelConsumption {
  date: string
  gpt4o: number
  claudeSonnet: number
  geminiPro: number
  deepseekChat: number
}

export interface ModelCallCount {
  model: ModelKey
  calls: number
  fill: string
}

export type LatencyLevel = 'fast' | 'normal' | 'slow'

export interface ApiEndpoint {
  id: string
  name: string
  url: string
  latencyMs: number
  latencyLevel: LatencyLevel
}

export type AnnouncementType = 'info' | 'update' | 'maintenance'

export interface Announcement {
  id: string
  title: string
  content: string
  date: string
  type: AnnouncementType
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export type ServiceHealth = 'operational' | 'degraded' | 'outage'

export interface ServiceStatus {
  id: string
  name: string
  status: ServiceHealth
  uptime: string
  history: ServiceHealth[]
}
