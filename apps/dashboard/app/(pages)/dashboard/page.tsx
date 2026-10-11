import { hasRole } from '@workspace/server/auth/access'

import {
  fetchDailyActivity,
  fetchDashboardStats,
  fetchRecentLogins,
  fetchRecentRedemptions,
  fetchRecentUsers,
  fetchTopInviters,
} from '@/app/server/db/stats'
import { verifySession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { SectionCard } from '@/components/ui/section-card'
import { StatCard } from '@/components/ui/stat-card'

import { ChartCard } from './chart-card'
import { getChartTabs, getSideCards, getStatCards } from './data'
import { RefreshButton } from './refresh-button'

export default async function DashboardPage(): Promise<React.ReactNode> {
  const { user } = await verifySession()
  const [stats, activity, inviters, recentLogins, recentUsers, recentRedemptions] = await Promise.all([
    fetchDashboardStats(),
    fetchDailyActivity(30),
    fetchTopInviters(5),
    fetchRecentLogins(5),
    fetchRecentUsers(5),
    fetchRecentRedemptions(hasRole(user.role, 'admin'), 5),
  ])

  const data = { stats, activity, inviters, recentLogins, recentUsers, recentRedemptions }
  const statCards = getStatCards(data)
  const sideCards = getSideCards(data)
  const chartTabs = getChartTabs(data)

  return (
    <SectionPageLayout
      title="儀表板"
      description="掌握主站的使用者、邀請碼與登入活動"
      actions={<RefreshButton />}
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">
          早安，{user.name} 👋
        </p>
        <p className="text-sm text-muted-foreground">以下是 Kreads 主站目前的概況。</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map(group => (
          <section key={group.id} aria-labelledby={`stat-group-${group.id}`} className="flex min-w-0 flex-col gap-2">
            <h2 id={`stat-group-${group.id}`} className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h2>
            <div className="flex flex-col gap-3">
              {group.cards.map(({ id, ...card }) => (
                <StatCard key={id} {...card} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:sticky xl:top-18 xl:col-span-2 xl:self-start">
          <ChartCard tabs={chartTabs} days={activity.length} />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          {sideCards.map(({ id, title, description, content }) => (
            <SectionCard key={id} title={title} description={description} className="min-w-0">
              {content}
            </SectionCard>
          ))}
        </div>
      </div>
    </SectionPageLayout>
  )
}
