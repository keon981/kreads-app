import { formatDateTime } from '@workspace/ui/lib/format'

import { UserAvatar } from '@/components/ui/user-avatar'

import { sumOf } from './utils'

import type { ActivityUser, DailyActivity, RedeemedInvite } from '@/types/stats'

interface ActivityUserListProps {
  users: ActivityUser[]
  emptyText: string
}

export function ActivityUserList({ users, emptyText }: ActivityUserListProps): React.ReactNode {
  if (users.length === 0) return <p className="text-sm text-muted-foreground">{emptyText}</p>

  return (
    <ul className="flex flex-col gap-3">
      {users.map(user => (
        <li key={`${user.username ?? user.name}-${user.time.getTime()}`} className="flex items-center gap-3">
          <UserAvatar user={user} className="size-8" />
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-sm font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.username ?? '未完成註冊'}</span>
          </div>
          <time dateTime={user.time.toISOString()} className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatDateTime(user.time)}
          </time>
        </li>
      ))}
    </ul>
  )
}

interface RedemptionListProps {
  invites: RedeemedInvite[]
}

export function RedemptionList({ invites }: RedemptionListProps): React.ReactNode {
  if (invites.length === 0) return <p className="text-sm text-muted-foreground">還沒有核銷紀錄</p>

  return (
    <ul className="flex flex-col gap-3">
      {invites.map(invite => (
        <li key={`${invite.code}-${invite.redeemedAt.getTime()}`} className="flex items-center gap-3">
          <code className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">{invite.code}</code>
          <span className="min-w-0 flex-1 truncate text-sm">{invite.redeemer?.name ?? '已刪除的使用者'}</span>
          <time dateTime={invite.redeemedAt.toISOString()} className="shrink-0 text-xs text-muted-foreground tabular-nums">
            {formatDateTime(invite.redeemedAt)}
          </time>
        </li>
      ))}
    </ul>
  )
}

interface DailyLoginStripProps {
  activity: DailyActivity[]
}

export function DailyLoginStrip({ activity }: DailyLoginStripProps): React.ReactNode {
  const maxLogins = Math.max(...activity.map(day => day.logins), 1)

  return (
    <>
      <div className="flex h-6 gap-0.5" role="img" aria-label={`近 ${activity.length} 天共登入 ${sumOf(activity, 'logins')} 次`}>
        {activity.map(day => (
          <span
            key={day.date}
            title={`${day.date}：${day.logins} 次`}
            data-level={Math.ceil((day.logins / maxLogins) * 3)}
            className="min-w-0 flex-1 rounded-[2px] bg-muted data-[level=1]:bg-primary/30 data-[level=2]:bg-primary/60 data-[level=3]:bg-primary"
          />
        ))}
      </div>
      <div className="mt-3 flex justify-between text-xs text-muted-foreground">
        <span>{`${activity.length} 天前`}</span>
        <span>今天</span>
      </div>
    </>
  )
}
