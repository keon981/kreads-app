import { RiGroupLine, RiMailLine, RiUserLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Card, CardContent } from '@workspace/ui/components/card'
import { Separator } from '@workspace/ui/components/separator'

import { UserAvatar } from '@/components/layout/user-menu'
import { ProfileStats } from '@/views/pages/profile/profile-stats'

import type { ProfileStat } from '@/types/profile'
import type { CurrentUser } from '@/types/user'

interface ProfileHeaderProps {
  user: CurrentUser
  stats: readonly ProfileStat[]
}

export function ProfileHeader({ user, stats }: ProfileHeaderProps): React.ReactNode {
  return (
    <Card>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <UserAvatar
            user={user}
            className="size-16 **:data-[slot=avatar-fallback]:text-2xl **:data-[slot=avatar-fallback]:font-semibold"
          />
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-xl font-semibold tracking-tight">{user.displayName}</h2>
              <Badge>{user.role}</Badge>
              <Badge variant="outline">{`ID: ${user.id}`}</Badge>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <li className="flex min-w-0 items-center gap-1.5">
                <RiUserLine className="size-4 shrink-0" />
                <span className="truncate">{`@${user.username}`}</span>
              </li>
              <li className="flex min-w-0 items-center gap-1.5">
                <RiMailLine className="size-4 shrink-0" />
                <span className="truncate">{user.email}</span>
              </li>
              <li className="flex min-w-0 items-center gap-1.5">
                <RiGroupLine className="size-4 shrink-0" />
                <span className="truncate">{`分組：${user.group}`}</span>
              </li>
            </ul>
          </div>
        </div>
        <Separator />
        <ProfileStats stats={stats} />
      </CardContent>
    </Card>
  )
}
