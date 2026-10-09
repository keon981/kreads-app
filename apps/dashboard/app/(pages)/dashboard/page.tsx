import { SectionPageLayout } from '@/components/blocks/section-page-layout'
import { AnnouncementCard } from '@/views/dashboards/announcement-card'
import { ApiInfoCard } from '@/views/dashboards/api-info-card'
import { DashboardActions } from '@/views/dashboards/dashboard-actions'
import { DashboardGreeting } from '@/views/dashboards/dashboard-greeting'
import { FaqCard } from '@/views/dashboards/faq-card'
import { ModelAnalytics } from '@/views/dashboards/model-analytics'
import { ServiceStatusCard } from '@/views/dashboards/service-status-card'
import { StatOverview } from '@/views/dashboards/stat-overview'

export default function DashboardPage(): React.ReactNode {
  return (
    <SectionPageLayout
      title="數據看板"
      description="掌握帳戶餘額、用量與各模型的調用狀況"
      actions={<DashboardActions />}
    >
      <DashboardGreeting />
      <StatOverview />
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 xl:sticky xl:top-18 xl:col-span-2 xl:self-start">
          <ModelAnalytics />
        </div>
        <div className="flex min-w-0 flex-col gap-4">
          <ApiInfoCard />
          <AnnouncementCard />
          <FaqCard />
          <ServiceStatusCard />
        </div>
      </div>
    </SectionPageLayout>
  )
}
