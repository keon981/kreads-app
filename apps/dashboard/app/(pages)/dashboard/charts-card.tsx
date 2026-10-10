'use client'

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@workspace/ui/components/chart'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'

import { dailyModelConsumption, modelCallCounts, models } from '@/__mocks__/dashboard'
import { SectionCard } from '@/components/ui/section-card'

import type { ChartConfig } from '@workspace/ui/components/chart'

const chartConfig: ChartConfig = {
  calls: { label: '調用次數' },
  ...Object.fromEntries(models.map(model => [model.key, { label: model.name, color: model.color }])),
}

const chartClassName = 'aspect-auto h-64 w-full'

function formatCount(value: unknown): string {
  return typeof value === 'number' ? value.toLocaleString('en-US') : String(value)
}

// Rendered outside Recharts: its legend keeps the height measured at the
// initial 320px width, leaving a gap once the container grows
function ChartLegend(): React.ReactNode {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs">
      {models.map(model => (
        <li key={model.key} className="flex items-center gap-1.5">
          <span aria-hidden className="size-2 shrink-0 rounded-[2px]" style={{ backgroundColor: model.color }} />
          {model.name}
        </li>
      ))}
    </ul>
  )
}

export function ChartsCard(): React.ReactNode {
  const totalCalls = modelCallCounts.reduce((sum, item) => sum + item.calls, 0)

  const tabs = [
    {
      value: 'consumption',
      label: '消耗分布',
      content: (
        <>
          <ChartContainer config={chartConfig} className={chartClassName}>
            <BarChart accessibilityLayer data={dailyModelConsumption} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={value => `$${value}`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              {models.map((model, index) => (
                <Bar
                  key={model.key}
                  dataKey={model.key}
                  stackId="consumption"
                  fill={`var(--color-${model.key})`}
                  radius={index === models.length - 1 ? [4, 4, 0, 0] : 0}
                />
              ))}
            </BarChart>
          </ChartContainer>
          <ChartLegend />
        </>
      ),
    },
    {
      value: 'trend',
      label: '消耗趨勢',
      content: (
        <>
          <ChartContainer config={chartConfig} className={chartClassName}>
            <LineChart accessibilityLayer data={dailyModelConsumption} margin={{ left: 0, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={value => `$${value}`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
              {models.map(model => (
                <Line
                  key={model.key}
                  dataKey={model.key}
                  type="monotone"
                  stroke={`var(--color-${model.key})`}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ChartContainer>
          <ChartLegend />
        </>
      ),
    },
    {
      value: 'calls',
      label: '調用次數分布',
      content: (
        <>
          <ChartContainer config={chartConfig} className={chartClassName}>
            <PieChart accessibilityLayer>
              <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="model" hideLabel />} />
              <Pie
                data={modelCallCounts}
                dataKey="calls"
                nameKey="model"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                stroke="var(--background)"
              >
                <Label
                  content={({ viewBox }): React.ReactElement | null => {
                    if (!viewBox || !('cx' in viewBox) || !('cy' in viewBox))
                      return null
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-xl font-semibold">
                          {formatCount(totalCalls)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy ?? 0) + 20} className="fill-muted-foreground">
                          總調用次數
                        </tspan>
                      </text>
                    )
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
          <ChartLegend />
        </>
      ),
    },
    {
      value: 'ranking',
      label: '調用次數排行',
      content: (
        <ChartContainer config={chartConfig} className="aspect-auto h-72 w-full">
          <BarChart accessibilityLayer data={modelCallCounts} layout="vertical" margin={{ left: 0, right: 56 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="calls" hide />
            <YAxis
              type="category"
              dataKey="model"
              tickLine={false}
              axisLine={false}
              width={104}
              tickFormatter={key => models.find(model => model.key === key)?.name ?? key}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="model" hideLabel />} />
            <Bar dataKey="calls" radius={4} barSize={28}>
              <LabelList
                dataKey="calls"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
                formatter={formatCount}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      ),
    },
  ]

  return (
    <SectionCard title="模型數據分析" description="近 7 天各模型的額度消耗（USD）與調用次數" className="min-w-0">
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
