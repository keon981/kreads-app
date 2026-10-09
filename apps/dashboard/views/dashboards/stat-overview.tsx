'use client'

import { statGroups } from '@/__mocks__/dashboard'
import { StatCard } from '@/components/blocks/stat-card'

export function StatOverview(): React.ReactNode {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statGroups.map(group => (
        <section key={group.id} aria-labelledby={`stat-group-${group.id}`} className="flex min-w-0 flex-col gap-2">
          <h2 id={`stat-group-${group.id}`} className="text-sm font-medium text-muted-foreground">
            {group.title}
          </h2>
          <div className="flex flex-col gap-3">
            {group.metrics.map(metric => (
              <StatCard
                key={metric.id}
                label={metric.label}
                value={metric.value}
                description={metric.description}
                icon={metric.icon}
                trend={metric.trend}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
