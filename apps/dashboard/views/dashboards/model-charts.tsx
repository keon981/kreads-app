'use client'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart'
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

import type { ChartConfig } from '@workspace/ui/components/chart'

const modelChartConfig: ChartConfig = {
  calls: { label: '調用次數' },
  ...Object.fromEntries(models.map(model => [model.key, { label: model.name, color: model.color }])),
}

const chartClassName = 'aspect-auto h-64 w-full'

const totalCalls = modelCallCounts.reduce((sum, item) => sum + item.calls, 0)

function getModelName(key: string): string {
  return models.find(model => model.key === key)?.name ?? key
}

function formatCount(value: unknown): string {
  return typeof value === 'number' ? value.toLocaleString('en-US') : String(value)
}

function formatCurrency(value: number): string {
  return `$${value}`
}

// Rendered outside Recharts: its legend keeps the height measured at the
// initial 320px width, leaving a gap once the container grows
function ModelLegend(): React.ReactNode {
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

export function ConsumptionDistributionChart(): React.ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={modelChartConfig} className={chartClassName}>
        <BarChart accessibilityLayer data={[...dailyModelConsumption]} margin={{ left: 0, right: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={formatCurrency} />
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
      <ModelLegend />
    </div>
  )
}

export function ConsumptionTrendChart(): React.ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={modelChartConfig} className={chartClassName}>
        <LineChart accessibilityLayer data={[...dailyModelConsumption]} margin={{ left: 0, right: 12 }}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tickLine={false} axisLine={false} width={40} tickFormatter={formatCurrency} />
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
      <ModelLegend />
    </div>
  )
}

export function CallDistributionChart(): React.ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <ChartContainer config={modelChartConfig} className={chartClassName}>
        <PieChart accessibilityLayer>
          <ChartTooltip cursor={false} content={<ChartTooltipContent nameKey="model" hideLabel />} />
          <Pie
            data={[...modelCallCounts]}
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
      <ModelLegend />
    </div>
  )
}

export function CallRankingChart(): React.ReactNode {
  return (
    <ChartContainer config={modelChartConfig} className="aspect-auto h-72 w-full">
      <BarChart accessibilityLayer data={[...modelCallCounts]} layout="vertical" margin={{ left: 0, right: 56 }}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" dataKey="calls" hide />
        <YAxis
          type="category"
          dataKey="model"
          tickLine={false}
          axisLine={false}
          width={104}
          tickFormatter={getModelName}
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
  )
}
