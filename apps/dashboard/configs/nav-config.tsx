import {
  RiComputerLine,
  RiCoupon3Line,
  RiDashboard3Line,
  RiMoonLine,
  RiSunLine,
  RiTeamLine,
  RiUserSettingsLine,
} from '@remixicon/react'

import { paths } from '@/configs/path-config'

import type { RemixiconComponentType } from '@remixicon/react'

export interface NavItem {
  title: string
  href: string
  icon: RemixiconComponentType
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: '控制台',
    items: [
      { title: '儀表板', href: paths.dashboard, icon: RiDashboard3Line },
    ],
  },
  {
    label: '管理',
    items: [
      { title: '使用者管理', href: paths.users, icon: RiTeamLine },
      { title: '邀請碼管理', href: paths.invites, icon: RiCoupon3Line },
    ],
  },
  {
    label: '個人管理',
    items: [
      { title: '個人設定', href: paths.profile, icon: RiUserSettingsLine },
    ],
  },
]

export const themeOptions = [
  { value: 'light', label: '淺色模式', icon: RiSunLine },
  { value: 'dark', label: '深色模式', icon: RiMoonLine },
  { value: 'system', label: '跟隨系統', icon: RiComputerLine },
]

export function getActiveNavItem(pathname: string): NavItem | undefined {
  return navGroups
    .flatMap(group => group.items)
    .find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))
}
