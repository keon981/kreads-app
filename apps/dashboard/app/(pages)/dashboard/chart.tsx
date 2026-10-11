'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'

import type { ChartConfig } from '@workspace/ui/components/chart'
import type { DailyActivity, InviterRank } from '@/types/stats'

const chartConfig: ChartConfig = {
  registrations: { label: '新註冊', color: 'var(--chart-2)' },
  redemptions: { label: '核銷', color: 'var(--chart-1)' },
  logins: { label: '登入', color: 'var(--chart-3)' },
  count: { label: '邀請人數', color: 'var(--chart-2)' },
}

const chartClassName = 'aspect-auto h-64 w-full'

type ActivityKey = 'registrations' | 'redemptions' | 'logins'

interface ActivityChartProps {
  activity: DailyActivity[]
  dataKey: ActivityKey
}

export function ActivityBarChart({ activity, dataKey }: ActivityChartProps): React.ReactNode {
  return (
    <ChartContainer config={chartConfig} className={chartClassName}>
      <BarChart accessibilityLayer data={activity} margin={{ left: 0, right: 8 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar dataKey={dataKey} fill={`var(--color-${dataKey})`} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}

export function ActivityLineChart({ activity, dataKey }: ActivityChartProps): React.ReactNode {
  return (
    <ChartContainer config={chartConfig} className={chartClassName}>
      <LineChart accessibilityLayer data={activity} margin={{ left: 0, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Line dataKey={dataKey} type="monotone" stroke={`var(--color-${dataKey})`} strokeWidth={2} dot={false} />
      </LineChart>
    </ChartContainer>
  )
}

interface InviterChartProps {
  inviters: InviterRank[]
}

export function InviterChart({ inviters }: InviterChartProps): React.ReactNode {
  if (inviters.length === 0) {
    return <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">還沒有人透過邀請註冊</p>
  }

  return (
    <ChartContainer config={chartConfig} className={chartClassName}>
      <BarChart accessibilityLayer data={inviters} layout="vertical" margin={{ left: 0, right: 40 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" dataKey="count" hide />
        <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} width={104} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} barSize={28}>
          <LabelList dataKey="count" position="right" offset={8} className="fill-foreground" fontSize={12} />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
