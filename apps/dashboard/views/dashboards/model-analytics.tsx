'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'

import {
  CallDistributionChart,
  CallRankingChart,
  ConsumptionDistributionChart,
  ConsumptionTrendChart,
} from '@/views/dashboards/model-charts'

const analyticsTabs = [
  { value: 'consumption', label: '消耗分布', chart: ConsumptionDistributionChart },
  { value: 'trend', label: '消耗趨勢', chart: ConsumptionTrendChart },
  { value: 'calls', label: '調用次數分布', chart: CallDistributionChart },
  { value: 'ranking', label: '調用次數排行', chart: CallRankingChart },
] as const

export function ModelAnalytics(): React.ReactNode {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle>模型數據分析</CardTitle>
        <CardDescription>近 7 天各模型的額度消耗（USD）與調用次數</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0">
        <Tabs defaultValue={analyticsTabs[0].value} className="gap-4">
          <TabsList className="grid w-full grid-cols-2 group-data-horizontal/tabs:h-auto sm:inline-flex sm:w-fit sm:group-data-horizontal/tabs:h-8">
            {analyticsTabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value} className="py-1 sm:py-0.5">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {analyticsTabs.map(({ value, chart: Chart }) => (
            <TabsContent key={value} value={value} className="min-w-0">
              <Chart />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
