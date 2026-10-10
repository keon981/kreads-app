import { RiFilter3Line, RiMegaphoneLine, RiQuestionLine, RiRefreshLine, RiServerLine, RiShieldCheckLine } from '@remixicon/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@workspace/ui/components/accordion'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'

import { announcements, apiEndpoints, faqItems, serviceStatuses, statGroups } from '@/__mocks__/dashboard'
import { currentUser } from '@/__mocks__/user'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { CopyButton } from '@/components/ui/copy-button'
import { SectionCard } from '@/components/ui/section-card'
import { StatCard } from '@/components/ui/stat-card'

import { ChartsCard } from './charts-card'

import type { ServiceHealth } from './types'

const healthLabels: Record<ServiceHealth, string> = {
  operational: '正常',
  degraded: '效能下降',
  outage: '中斷',
}

const statusBadgeClassName = 'data-[status=degraded]:bg-amber-500/10 data-[status=degraded]:text-amber-700 data-[status=fast]:bg-emerald-500/10 data-[status=fast]:text-emerald-700 data-[status=normal]:bg-amber-500/10 data-[status=normal]:text-amber-700 data-[status=operational]:bg-emerald-500/10 data-[status=operational]:text-emerald-700 data-[status=outage]:bg-red-500/10 data-[status=outage]:text-red-700 data-[status=slow]:bg-red-500/10 data-[status=slow]:text-red-700 dark:data-[status=degraded]:text-amber-400 dark:data-[status=fast]:text-emerald-400 dark:data-[status=normal]:text-amber-400 dark:data-[status=operational]:text-emerald-400 dark:data-[status=outage]:text-red-400 dark:data-[status=slow]:text-red-400'

export default function DashboardPage(): React.ReactNode {
  const sideCards = [
    {
      key: 'api',
      title: (
        <>
          <RiServerLine />
          API 資訊
        </>
      ),
      description: '選擇延遲最低的線路作為 Base URL',
      content: (
        <ul className="flex flex-col gap-2">
          {apiEndpoints.map(endpoint => (
            <li key={endpoint.id} className="flex items-center gap-3 rounded-lg border px-3 py-2">
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{endpoint.name}</span>
                  <Badge data-status={endpoint.latencyLevel} className={`tabular-nums ${statusBadgeClassName}`}>
                    {endpoint.latencyMs}
                    {' '}
                    ms
                  </Badge>
                </div>
                <code className="truncate font-mono text-xs text-muted-foreground">{endpoint.url}</code>
              </div>
              <CopyButton
                text={endpoint.url}
                successMessage={`已複製 ${endpoint.name} 網址`}
                aria-label={`複製 ${endpoint.name} 網址`}
              />
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: 'announcements',
      title: (
        <>
          <RiMegaphoneLine />
          系統公告
        </>
      ),
      description: '最新的服務動態與維護通知',
      content: (
        <ol className="relative flex flex-col gap-4 before:absolute before:inset-y-1 before:left-[3px] before:w-px before:bg-border">
          {announcements.map(announcement => (
            <li key={announcement.id} className="relative flex gap-3">
              <span
                aria-hidden
                data-type={announcement.type}
                className="relative mt-1.5 size-[7px] shrink-0 rounded-full ring-4 ring-card data-[type=info]:bg-sky-500 data-[type=maintenance]:bg-amber-500 data-[type=update]:bg-emerald-500"
              />
              <div className="flex min-w-0 flex-col gap-0.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <span className="text-sm font-medium">{announcement.title}</span>
                  <time dateTime={announcement.date} className="text-xs text-muted-foreground tabular-nums">
                    {announcement.date}
                  </time>
                </div>
                <p className="text-xs text-muted-foreground">{announcement.content}</p>
              </div>
            </li>
          ))}
        </ol>
      ),
    },
    {
      key: 'faq',
      title: (
        <>
          <RiQuestionLine />
          常見問答
        </>
      ),
      content: (
        <Accordion>
          {faqItems.map(item => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ),
    },
    {
      key: 'services',
      title: (
        <>
          <RiShieldCheckLine />
          服務可用性
        </>
      ),
      description: '近 30 天各服務的運作狀態',
      content: (
        <>
          <ul className="flex flex-col gap-4">
            {serviceStatuses.map(service => (
              <li key={service.id} className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{service.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">{service.uptime}</span>
                    <Badge data-status={service.status} className={statusBadgeClassName}>
                      {healthLabels[service.status]}
                    </Badge>
                  </div>
                </div>
                <div className="flex h-6 gap-0.5" role="img" aria-label={`${service.name} 近 30 天可用率 ${service.uptime}`}>
                  {service.history.map((health, index) => (
                    <span
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      title={healthLabels[health]}
                      data-status={health}
                      className="min-w-0 flex-1 rounded-[2px] data-[status=degraded]:bg-amber-500 data-[status=operational]:bg-emerald-500 data-[status=outage]:bg-red-500"
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
        </>
      ),
    },
  ]

  return (
    <SectionPageLayout
      title="數據看板"
      description="掌握帳戶餘額、用量與各模型的調用狀況"
      actions={(
        <>
          <Button variant="outline">
            <RiRefreshLine data-icon="inline-start" />
            重新整理
          </Button>
          <Button>
            <RiFilter3Line data-icon="inline-start" />
            篩選
          </Button>
        </>
      )}
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">
          早安，
          {currentUser.displayName}
          {' '}
          👋
        </p>
        <p className="text-sm text-muted-foreground">以下是你近 7 天的 API 使用概況。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statGroups.map(group => (
          <section key={group.id} aria-labelledby={`stat-group-${group.id}`} className="flex min-w-0 flex-col gap-2">
            <h2 id={`stat-group-${group.id}`} className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h2>
            <div className="flex flex-col gap-3">
              {group.metrics.map(({ id, label, value, description, icon: Icon, trend }) => (
                <StatCard
                  key={id}
                  label={label}
                  value={value}
                  description={description}
                  icon={<Icon />}
                  trend={trend}
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:sticky xl:top-18 xl:col-span-2 xl:self-start">
          <ChartsCard />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          {sideCards.map(({ key, title, description, content }) => (
            <SectionCard key={key} title={title} description={description} className="min-w-0">
              {content}
            </SectionCard>
          ))}
        </div>
      </div>
    </SectionPageLayout>
  )
}
