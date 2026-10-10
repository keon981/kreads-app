import {
  RiComputerLine,
  RiDashboard3Line,
  RiKey2Line,
  RiMoonLine,
  RiSunLine,
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
      { title: '數據看板', href: paths.dashboard, icon: RiDashboard3Line },
      { title: '令牌管理', href: paths.keys, icon: RiKey2Line },
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
