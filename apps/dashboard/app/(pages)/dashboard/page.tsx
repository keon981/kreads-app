import { fetchDashboardDetails, fetchDashboardSummary, fetchDashboardSummaryCache } from '@/app/server/db/stats'
import { getAudience, getSession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { SectionCard } from '@/components/ui/section-card'
import { StatCard } from '@/components/ui/stat-card'

import { ChartCard } from './chart-card'
import { getChartTabs, getSideCards, getStatCards, publicStatCardIds } from './data'
import { RefreshButton } from './refresh-button'

export default async function DashboardPage(): Promise<React.ReactNode> {
  const session = await getSession()
  const isAdmin = getAudience(session) === 'admin'
  const [summary, details] = await Promise.all([
    isAdmin ? fetchDashboardSummary() : fetchDashboardSummaryCache(),
    isAdmin ? fetchDashboardDetails() : null,
  ])
  const allStatCards = getStatCards(summary)
  const statCards = isAdmin ? allStatCards : allStatCards.filter(card => publicStatCardIds.includes(card.id))
  const adminData = details ? { ...summary, ...details } : null

  return (
    <SectionPageLayout
      title="儀表板"
      description="掌握主站的使用者、邀請碼與登入活動"
      actions={isAdmin && <RefreshButton />}
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">
          早安，{session?.user.name ?? '訪客'} 👋
        </p>
        <p className="text-sm text-muted-foreground">以下是 Kreads 主站目前的概況。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(({ id, ...card }) => (
          <StatCard key={id} {...card} />
        ))}
      </div>

      {adminData && (
        <div className="grid gap-4 xl:grid-cols-3">
          <div className="min-w-0 xl:sticky xl:top-18 xl:col-span-2 xl:self-start">
            <ChartCard tabs={getChartTabs(adminData)} days={adminData.activity.length} />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            {getSideCards(adminData).map(({ id, title, description, content }) => (
              <SectionCard key={id} title={title} description={description} className="min-w-0">
                {content}
              </SectionCard>
            ))}
          </div>
        </div>
      )}
    </SectionPageLayout>
  )
}
