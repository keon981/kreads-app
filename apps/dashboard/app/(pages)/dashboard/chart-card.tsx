import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'

import { SectionCard } from '@/components/ui/section-card'

import type { ChartTab } from './data'

interface ChartCardProps {
  tabs: ChartTab[]
  days: number
}

export function ChartCard({ tabs, days }: ChartCardProps): React.ReactNode {
  return (
    <SectionCard title="使用者活動" description={`近 ${days} 天的註冊、核銷與登入次數`} className="min-w-0">
      <Tabs defaultValue={tabs[0].id} className="gap-4">
        <TabsList className="grid w-full grid-cols-2 group-data-horizontal/tabs:h-auto sm:inline-flex sm:w-fit sm:group-data-horizontal/tabs:h-8">
          {tabs.map(tab => (
            <TabsTrigger key={tab.id} value={tab.id} className="py-1 sm:py-0.5">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {tabs.map(tab => (
          <TabsContent key={tab.id} value={tab.id} className="flex min-w-0 flex-col gap-3">
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </SectionCard>
  )
}
