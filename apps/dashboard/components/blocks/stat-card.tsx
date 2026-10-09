'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { ChartContainer } from '@workspace/ui/components/chart'
import { Area, AreaChart } from 'recharts'

import type { RemixiconComponentType } from '@remixicon/react'
import type { ChartConfig } from '@workspace/ui/components/chart'

export interface StatTrendPoint {
  readonly value: number
}

interface StatCardProps {
  label: string
  value: string
  description?: string
  icon?: RemixiconComponentType
  trend?: readonly StatTrendPoint[]
  className?: string
}

const trendChartConfig = {
  value: { label: 'Value', color: 'var(--chart-2)' },
} satisfies ChartConfig

export function StatCard({
  label,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps): React.ReactNode {
  return (
    <Card size="sm" className={className}>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          {Icon && <Icon className="size-4" />}
          {label}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <CardTitle className="truncate text-2xl font-semibold tabular-nums group-data-[size=sm]/card:text-2xl">{value}</CardTitle>
          {description && (
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        {trend && trend.length > 0 && (
          <ChartContainer config={trendChartConfig} className="aspect-auto h-10 w-24 shrink-0">
            <AreaChart data={[...trend]} margin={{ top: 2, right: 0, bottom: 2, left: 0 }}>
              <Area
                dataKey="value"
                type="monotone"
                stroke="var(--color-value)"
                fill="var(--color-value)"
                fillOpacity={0.15}
                strokeWidth={1.5}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
