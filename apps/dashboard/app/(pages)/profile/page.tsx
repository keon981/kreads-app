import { RiGroupLine, RiMailLine, RiUserLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'

import { profileSettings, profileStats } from '@/__mocks__/profile'
import { currentUser } from '@/__mocks__/user'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { StatCard } from '@/components/ui/stat-card'
import { UserAvatar } from '@/components/ui/user-avatar'

import { ProfileSettingsForm } from './form'

export default function ProfilePage(): React.ReactNode {
  const contacts = [
    { icon: <RiUserLine />, text: `@${currentUser.username}` },
    { icon: <RiMailLine />, text: currentUser.email },
    { icon: <RiGroupLine />, text: `分組：${currentUser.group}` },
  ]

  return (
    <SectionPageLayout
      title="個人設定"
      description="檢視帳號資訊，並管理基本資料與通知偏好。"
      className="mx-auto max-w-4xl"
    >
      <Card>
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <UserAvatar
              user={currentUser}
              className="size-16 **:data-[slot=avatar-fallback]:text-2xl **:data-[slot=avatar-fallback]:font-semibold"
            />
            <div className="flex min-w-0 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-heading text-xl font-semibold tracking-tight">{currentUser.displayName}</h2>
                <Badge>{currentUser.role}</Badge>
                <Badge variant="outline">{`ID: ${currentUser.id}`}</Badge>
              </div>
              <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                {contacts.map(({ icon, text }) => (
                  <li key={text} className="flex min-w-0 items-center gap-1.5 [&_svg]:size-4 [&_svg]:shrink-0">
                    {icon}
                    <span className="truncate">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Separator />
          <div className="grid gap-4 sm:grid-cols-3">
            {profileStats.map(({ key, label, value, description, icon: Icon, trend }) => (
              <StatCard
                key={key}
                label={label}
                value={value}
                description={description}
                icon={<Icon />}
                trend={trend}
              />
            ))}
          </div>
        </CardContent>
      </Card>
      <ProfileSettingsForm defaultSettings={profileSettings} />
    </SectionPageLayout>
  )
}
