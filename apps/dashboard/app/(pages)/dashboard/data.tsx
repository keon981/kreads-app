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

import { ActivityUserList, DailyLoginStrip, RedemptionList } from './activity-list'
import { ActivityBarChart, ActivityLineChart, InviterChart } from './chart'
import { formatCount, sumOf } from './utils'

import type { StatCard } from '@/components/ui/stat-card'
import type { ActivityUser, DailyActivity, DashboardStats, InviterRank, RedeemedInvite } from '@/types/stats'

interface DashboardData {
  stats: DashboardStats
  activity: DailyActivity[]
  inviters: InviterRank[]
  recentLogins: ActivityUser[]
  recentUsers: ActivityUser[]
  recentRedemptions: RedeemedInvite[]
}

interface StatCardGroup {
  id: string
  title: string
  cards: (React.ComponentProps<typeof StatCard> & { id: string })[]
}

export function getStatCards({ stats, activity }: DashboardData): StatCardGroup[] {
  const lastWeek = activity.slice(-7)

  return [
    {
      id: 'users',
      title: '使用者',
      cards: [
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
      cards: [
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
      cards: [
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
      cards: [
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
}

interface SideCard {
  id: string
  title: React.ReactNode
  description: string
  content: React.ReactNode
}

export function getSideCards({ activity, recentLogins, recentUsers, recentRedemptions }: DashboardData): SideCard[] {
  return [
    {
      id: 'logins',
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
      id: 'users',
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
      id: 'redemptions',
      title: (
        <>
          <RiCoupon3Line />
          最近核銷的碼
        </>
      ),
      description: '最近被用來註冊的邀請碼',
      content: <RedemptionList invites={recentRedemptions} />,
    },
    {
      id: 'daily-logins',
      title: (
        <>
          <RiCalendarCheckLine />
          每日登入
        </>
      ),
      description: `近 ${activity.length} 天每天的登入次數`,
      content: <DailyLoginStrip activity={activity} />,
    },
  ]
}

export interface ChartTab {
  id: string
  label: string
  content: React.ReactNode
}

export function getChartTabs({ activity, inviters }: DashboardData): ChartTab[] {
  return [
    { id: 'registrations', label: '註冊走勢', content: <ActivityBarChart activity={activity} dataKey="registrations" /> },
    { id: 'redemptions', label: '核銷走勢', content: <ActivityLineChart activity={activity} dataKey="redemptions" /> },
    { id: 'logins', label: '登入走勢', content: <ActivityLineChart activity={activity} dataKey="logins" /> },
    { id: 'inviters', label: '邀請排行', content: <InviterChart inviters={inviters} /> },
  ]
}
