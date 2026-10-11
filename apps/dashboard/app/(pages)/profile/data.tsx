import { RiCalendarLine, RiComputerLine, RiLoginCircleLine } from '@remixicon/react'
import { formatDateTime } from '@workspace/ui/lib/format'

import type { StatCard } from '@/components/ui/stat-card'

interface ProfileStatsData {
  lastSignInAt: Date | null
  activeSessions: number
  createdAt: Date
}

type ProfileStat = React.ComponentProps<typeof StatCard> & { id: string }

export function getProfileStats({ lastSignInAt, activeSessions, createdAt }: ProfileStatsData): ProfileStat[] {
  return [
    { id: 'last-sign-in', label: '最近登入', value: lastSignInAt ? formatDateTime(lastSignInAt) : '—', icon: <RiLoginCircleLine /> },
    { id: 'sessions', label: '登入中的裝置', value: `${activeSessions} 台`, icon: <RiComputerLine /> },
    { id: 'created', label: '帳號建立', value: formatDateTime(createdAt), icon: <RiCalendarLine /> },
  ]
}

export const passwordFields = [
  { name: 'current_password', label: '目前密碼', autoComplete: 'current-password' },
  { name: 'new_password', label: '新密碼', autoComplete: 'new-password' },
  { name: 'confirm_password', label: '確認新密碼', autoComplete: 'new-password' },
]
