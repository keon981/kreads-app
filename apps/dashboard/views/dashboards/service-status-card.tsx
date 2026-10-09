'use client'

import { RiShieldCheckLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'

import { serviceStatuses } from '@/__mocks__/dashboard'

import type { ServiceHealth } from '@/types/dashboard'

interface HealthStyle {
  readonly label: string
  readonly badgeClassName: string
  readonly blockClassName: string
}

const healthStyles: Readonly<Record<ServiceHealth, HealthStyle>> = {
  operational: {
    label: '正常',
    badgeClassName: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
    blockClassName: 'bg-emerald-500',
  },
  degraded: {
    label: '效能下降',
    badgeClassName: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
    blockClassName: 'bg-amber-500',
  },
  outage: {
    label: '中斷',
    badgeClassName: 'bg-red-500/10 text-red-700 dark:text-red-400',
    blockClassName: 'bg-red-500',
  },
}

export function ServiceStatusCard(): React.ReactNode {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiShieldCheckLine className="size-4 text-muted-foreground" />
          服務可用性
        </CardTitle>
        <CardDescription>近 30 天各服務的運作狀態</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-4">
          {serviceStatuses.map(service => (
            <li key={service.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium">{service.name}</span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-xs text-muted-foreground tabular-nums">{service.uptime}</span>
                  <Badge className={healthStyles[service.status].badgeClassName}>
                    {healthStyles[service.status].label}
                  </Badge>
                </div>
              </div>
              <div className="flex h-6 gap-0.5" role="img" aria-label={`${service.name} 近 30 天可用率 ${service.uptime}`}>
                {service.history.map((health, index) => (
                  <span
                    // History entries have no id; the day index is stable
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    title={healthStyles[health].label}
                    className={cn('min-w-0 flex-1 rounded-[2px]', healthStyles[health].blockClassName)}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>30 天前</span>
          <span>今天</span>
        </div>
      </CardContent>
    </Card>
  )
}
