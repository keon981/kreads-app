'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'

import { SectionCard } from '@/components/ui/section-card'

import type { ChartConfig } from '@workspace/ui/components/chart'
import type { DailyActivity, InviterRank } from './types'

const chartConfig: ChartConfig = {
  registrations: { label: '新註冊', color: 'var(--chart-2)' },
  redemptions: { label: '核銷', color: 'var(--chart-1)' },
  logins: { label: '登入', color: 'var(--chart-3)' },
  count: { label: '邀請人數', color: 'var(--chart-2)' },
}

const chartClassName = 'aspect-auto h-64 w-full'

interface ChartsCardProps {
  activity: DailyActivity[]
  inviters: InviterRank[]
}

export function ChartsCard({ activity, inviters }: ChartsCardProps): React.ReactNode {
  const lineTabs = [
    { value: 'redemptions', label: '核銷走勢' },
    { value: 'logins', label: '登入走勢' },
  ]

  const tabs = [
    {
      value: 'registrations',
      label: '註冊走勢',
      content: (
        <ChartContainer config={chartConfig} className={chartClassName}>
          <BarChart accessibilityLayer data={activity} margin={{ left: 0, right: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="registrations" fill="var(--color-registrations)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      ),
    },
    ...lineTabs.map(({ value, label }) => ({
      value,
      label,
      content: (
        <ChartContainer config={chartConfig} className={chartClassName}>
          <LineChart accessibilityLayer data={activity} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
            <YAxis tickLine={false} axisLine={false} width={32} allowDecimals={false} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line dataKey={value} type="monotone" stroke={`var(--color-${value})`} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      ),
    })),
    {
      value: 'inviters',
      label: '邀請排行',
      content: inviters.length > 0
        ? (
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
        : <p className="flex h-64 items-center justify-center text-sm text-muted-foreground">還沒有人透過邀請註冊</p>,
    },
  ]

  return (
    <SectionCard title="使用者活動" description={`近 ${activity.length} 天的註冊、核銷與登入次數`} className="min-w-0">
      <Tabs defaultValue={tabs[0].value} className="gap-4">
        <TabsList className="grid w-full grid-cols-2 group-data-horizontal/tabs:h-auto sm:inline-flex sm:w-fit sm:group-data-horizontal/tabs:h-8">
          {tabs.map(tab => (
            <TabsTrigger key={tab.value} value={tab.value} className="py-1 sm:py-0.5">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.value} value={tab.value} className="flex min-w-0 flex-col gap-3">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </SectionCard>
  )
}
