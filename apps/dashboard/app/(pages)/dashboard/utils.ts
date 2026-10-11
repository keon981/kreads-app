import type { DailyActivity } from '@/types/stats'

export function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

export function sumOf(days: DailyActivity[], key: 'registrations' | 'redemptions' | 'logins'): number {
  return days.reduce((sum, day) => sum + day[key], 0)
}
