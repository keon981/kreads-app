'use client'

import { RiBarChartBoxLine, RiPulseLine, RiWallet3Line } from '@remixicon/react'

import { StatCard } from '@/components/blocks/stat-card'

import type { RemixiconComponentType } from '@remixicon/react'
import type { ProfileStat, ProfileStatKey } from '@/types/profile'

interface ProfileStatsProps {
  stats: readonly ProfileStat[]
}

const statIcons: Readonly<Record<ProfileStatKey, RemixiconComponentType>> = {
  balance: RiWallet3Line,
  usedQuota: RiBarChartBoxLine,
  requestCount: RiPulseLine,
}

export function ProfileStats({ stats }: ProfileStatsProps): React.ReactNode {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map(stat => (
        <StatCard
          key={stat.key}
          label={stat.label}
          value={stat.value}
          description={stat.description}
          icon={statIcons[stat.key]}
          trend={stat.trend}
        />
      ))}
    </div>
  )
}
