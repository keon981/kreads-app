import {
  RiCalendarCheckLine,
  RiCoupon3Line,
  RiCouponLine,
  RiForbidLine,
  RiLoginCircleLine,
  RiTeamLine,
  RiUserAddLine,
  RiUserForbidLine,
  RiUserStarLine,
} from '@remixicon/react'
import { hasRole } from '@workspace/server/auth/access'
import { formatDateTime } from '@workspace/ui/lib/format'

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
import { UserAvatar } from '@/components/ui/user-avatar'

import { ChartsCard } from './charts-card'
import { RefreshButton } from './refresh-button'

import type { ActivityUser, DailyActivity } from './types'

interface ActivityUserListProps {
  users: ActivityUser[]
  emptyText: string
}

function ActivityUserList({ users, emptyText }: ActivityUserListProps): React.ReactNode {
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

function formatCount(value: number): string {
  return value.toLocaleString('en-US')
}

function sumOf(days: DailyActivity[], key: 'registrations' | 'redemptions' | 'logins'): number {
  return days.reduce((sum, day) => sum + day[key], 0)
}

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

  const lastWeek = activity.slice(-7)
  const maxLogins = Math.max(...activity.map(day => day.logins), 1)

  const statGroups = [
    {
      id: 'users',
      title: '使用者',
      metrics: [
        {
          id: 'total',
          label: '使用者總數',
          value: formatCount(stats.totalUsers),
          description: `${formatCount(stats.invitedUsers)} 位透過使用者邀請加入`,
          icon: <RiTeamLine />,
        },
        {
          id: 'new',
          label: '近 7 天新註冊',
          value: formatCount(sumOf(lastWeek, 'registrations')),
          description: `近 30 天 ${formatCount(sumOf(activity, 'registrations'))} 位`,
          icon: <RiUserAddLine />,
          trend: lastWeek.map(day => ({ value: day.registrations })),
        },
      ],
    },
    {
      id: 'invites',
      title: '邀請碼',
      metrics: [
        {
          id: 'redeemed',
          label: '已核銷',
          value: formatCount(stats.redeemedInvites),
          description: `共 ${formatCount(stats.totalInvites)} 組邀請碼`,
          icon: <RiCoupon3Line />,
          trend: lastWeek.map(day => ({ value: day.redemptions })),
        },
        {
          id: 'unused',
          label: '未使用',
          value: formatCount(stats.totalInvites - stats.redeemedInvites),
          description: '可用於註冊主站',
          icon: <RiCouponLine />,
        },
      ],
    },
    {
      id: 'sessions',
      title: '登入活動',
      metrics: [
        {
          id: 'active',
          label: '有效登入',
          value: formatCount(stats.activeSessions),
          description: '主站目前登入中的裝置',
          icon: <RiLoginCircleLine />,
        },
        {
          id: 'logins',
          label: '近 7 天登入',
          value: formatCount(sumOf(lastWeek, 'logins')),
          description: `近 30 天 ${formatCount(sumOf(activity, 'logins'))} 次`,
          icon: <RiCalendarCheckLine />,
          trend: lastWeek.map(day => ({ value: day.logins })),
        },
      ],
    },
    {
      id: 'status',
      title: '帳號狀態',
      metrics: [
        {
          id: 'banned',
          label: '停權中',
          value: formatCount(stats.bannedUsers),
          description: '無法登入主站',
          icon: <RiUserForbidLine />,
        },
        {
          id: 'unregistered',
          label: '未完成註冊',
          value: formatCount(stats.unregisteredUsers),
          description: '已授權 GitHub，尚未建立貼文 repo',
          icon: <RiForbidLine />,
        },
      ],
    },
  ]

  const sideCards = [
    {
      key: 'logins',
      title: (
        <>
          <RiLoginCircleLine />
          近期登入
        </>
      ),
      description: '主站最近建立的登入',
      content: <ActivityUserList users={recentLogins} emptyText="還沒有登入紀錄" />,
    },
    {
      key: 'users',
      title: (
        <>
          <RiUserStarLine />
          最新註冊
        </>
      ),
      description: '最近加入主站的使用者',
      content: <ActivityUserList users={recentUsers} emptyText="還沒有使用者" />,
    },
    {
      key: 'redemptions',
      title: (
        <>
          <RiCoupon3Line />
          最近核銷的碼
        </>
      ),
      description: '最近被用來註冊的邀請碼',
      content: recentRedemptions.length > 0
        ? (
            <ul className="flex flex-col gap-3">
              {recentRedemptions.map(invite => (
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
        : <p className="text-sm text-muted-foreground">還沒有核銷紀錄</p>,
    },
    {
      key: 'daily-logins',
      title: (
        <>
          <RiCalendarCheckLine />
          每日登入
        </>
      ),
      description: `近 ${activity.length} 天每天的登入次數`,
      content: (
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
      ),
    },
  ]

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
        {statGroups.map(group => (
          <section key={group.id} aria-labelledby={`stat-group-${group.id}`} className="flex min-w-0 flex-col gap-2">
            <h2 id={`stat-group-${group.id}`} className="text-sm font-medium text-muted-foreground">
              {group.title}
            </h2>
            <div className="flex flex-col gap-3">
              {group.metrics.map(({ id, ...metric }) => (
                <StatCard key={id} {...metric} />
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="min-w-0 xl:sticky xl:top-18 xl:col-span-2 xl:self-start">
          <ChartsCard activity={activity} inviters={inviters} />
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
