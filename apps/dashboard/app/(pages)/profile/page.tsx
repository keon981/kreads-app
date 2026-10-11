import { RiMailLine } from '@remixicon/react'
import { hasRole } from '@workspace/server/auth/access'
import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'

import { fetchSessionSummary } from '@/app/server/db/users'
import { verifySession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { StatCard } from '@/components/ui/stat-card'
import { UserAvatar } from '@/components/ui/user-avatar'

import { getProfileStats } from './data'
import { AccountSettings } from './form'

export default async function ProfilePage(): Promise<React.ReactNode> {
  const { user } = await verifySession()
  const { activeSessions, lastSignInAt } = await fetchSessionSummary(user.id)
  const isViewer = hasRole(user.role, 'viewer')

  const stats = getProfileStats({ lastSignInAt, activeSessions, createdAt: user.createdAt })

  return (
    <SectionPageLayout
      title="個人設定"
      description="檢視後台帳號資訊，管理登入 Email 與密碼。"
      className="mx-auto max-w-4xl"
    >
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <UserAvatar
              user={user}
              className="size-16 **:data-[slot=avatar-fallback]:text-2xl **:data-[slot=avatar-fallback]:font-semibold"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-semibold tracking-tight">{user.name}</h2>
                <Badge variant={isViewer ? 'outline' : 'default'}>{isViewer ? 'user' : '最高意志'}</Badge>
              </div>
              <p className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground [&_svg]:size-4 [&_svg]:shrink-0">
                <RiMailLine />
                <span className="truncate">{user.email}</span>
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.map(({ id, ...stat }) => (
              <StatCard key={id} {...stat} />
            ))}
          </div>
        </CardContent>
      </Card>
      <AccountSettings email={user.email} isViewer={isViewer} />
    </SectionPageLayout>
  )
}
