import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@workspace/ui/components/chart'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts'

import type { Meta, StoryObj } from '@storybook/react-vite'
import type { ChartConfig } from '@workspace/ui/components/chart'

const data = [
  { month: 'Jan', posts: 186, replies: 80 },
  { month: 'Feb', posts: 305, replies: 200 },
  { month: 'Mar', posts: 237, replies: 120 },
  { month: 'Apr', posts: 73, replies: 190 },
  { month: 'May', posts: 209, replies: 130 },
  { month: 'Jun', posts: 214, replies: 140 },
]

const chartConfig = {
  posts: {
    label: 'Posts',
    color: 'var(--chart-1)',
  },
  replies: {
    label: 'Replies',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig

const meta = {
  title: 'Components/Chart',
  component: ChartContainer,
  args: {
    config: chartConfig,
    className: 'h-64 w-[32rem]',
  },
  argTypes: {
    children: { control: false },
  },
} satisfies Meta<typeof ChartContainer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="posts" fill="var(--color-posts)" radius={4} />
        <Bar dataKey="replies" fill="var(--color-replies)" radius={4} />
      </BarChart>
    ),
  },
}

export const MultiLine: Story = {
  args: {
    children: (
      <LineChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line dataKey="posts" type="monotone" stroke="var(--color-posts)" strokeWidth={2} dot={false} />
        <Line dataKey="replies" type="monotone" stroke="var(--color-replies)" strokeWidth={2} dot={false} />
      </LineChart>
    ),
  },
}

export const StackedArea: Story = {
  args: {
    children: (
      <AreaChart accessibilityLayer data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          dataKey="replies"
          type="natural"
          fill="var(--color-replies)"
          fillOpacity={0.4}
          stroke="var(--color-replies)"
          stackId="a"
        />
        <Area
          dataKey="posts"
          type="natural"
          fill="var(--color-posts)"
          fillOpacity={0.4}
          stroke="var(--color-posts)"
          stackId="a"
        />
      </AreaChart>
    ),
  },
}
