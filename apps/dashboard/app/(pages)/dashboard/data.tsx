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

import Code from '@/components/ui/code'

import { ActivityCard, DailyLoginStrip } from './activity-list'
import { ActivityBarChart, ActivityLineChart, InviterChart } from './chart'
import { formatCount, sumOf } from './utils'

import type { StatCard } from '@/components/ui/stat-card'
import type { ActivityUser, DashboardData, DashboardSummary } from '@/types/stats'
import type { Audience } from '@/types/user'

type StatCardItem = React.ComponentProps<typeof StatCard> & { id: string }

export const publicStatCardIds = ['total', 'new', 'active', 'logins']

export function getStatCards({ stats, activity }: DashboardSummary): StatCardItem[] {
  const lastWeek = activity.slice(-7)

  return [
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
  ]
}

export interface SideCard {
  id: string
  title: React.ReactNode
  description: React.ReactNode
  content: React.ReactNode
}

function getUserCard(items: ActivityUser[]) {
  return items.map(i => ({
    id: `${i.username ?? i.name}-${i.time.getTime()}`,
    title: i.name,
    description: i.username ?? '未完成註冊',
    time: i.time,
    name: i.name,
    image: i.image,
  }))
}

export function getSideCards(
  { activity, recentLogins, recentUsers, recentRedemptions }: DashboardData,
  audience?: Audience,
): SideCard[] {
  const cards: SideCard[] = [
    {
      id: 'logins',
      title: (
        <>
          <RiLoginCircleLine />
          近期登入
        </>
      ),
      description: '主站最近建立的登入',
      content: <ActivityCard items={getUserCard(recentLogins)} emptyText="還沒有登入紀錄" />,
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
      content: <ActivityCard items={getUserCard(recentUsers)} emptyText="還沒有使用者" />,
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
      content: (
        <ActivityCard
          items={recentRedemptions.map(i => ({
            id: `${i.code}-${i.redeemedAt.getTime()}`,
            title: i.redeemer?.name ?? '已刪除的使用者',
            description: <Code>{i.code}</Code>,
            time: i.redeemedAt,
            name: '',
          }))}
          emptyText="還沒有核銷紀錄"
        />
      ),
    },
  ]

  // Guests do not see the daily logins strip
  if (audience !== 'guest') {
    return [...cards, {
      id: 'daily-logins',
      title: (
        <>
          <RiCalendarCheckLine />
          每日登入
        </>
      ),
      description: `近 ${activity.length} 天每天的登入次數`,
      content: <DailyLoginStrip activity={activity} />,
    }]
  }

  return cards
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
