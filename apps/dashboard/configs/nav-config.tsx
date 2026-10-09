import {
  RiComputerLine,
  RiDashboard3Line,
  RiKey2Line,
  RiMoonLine,
  RiSunLine,
  RiUserSettingsLine,
} from '@remixicon/react'

import { PATHS } from '@/configs/constants'

import type { RemixiconComponentType } from '@remixicon/react'

export interface NavItem {
  readonly title: string
  readonly href: string
  readonly icon: RemixiconComponentType
}

export interface NavGroup {
  readonly label: string
  readonly items: readonly NavItem[]
}

export const navGroups: readonly NavGroup[] = [
  {
    label: '控制台',
    items: [
      { title: '數據看板', href: PATHS.dashboard, icon: RiDashboard3Line },
      { title: '令牌管理', href: PATHS.keys, icon: RiKey2Line },
    ],
  },
  {
    label: '個人管理',
    items: [
      { title: '個人設定', href: PATHS.profile, icon: RiUserSettingsLine },
    ],
  },
]

export const themeOptions = [
  { value: 'light', label: '淺色模式', icon: RiSunLine },
  { value: 'dark', label: '深色模式', icon: RiMoonLine },
  { value: 'system', label: '跟隨系統', icon: RiComputerLine },
] as const

export function getActiveNavItem(pathname: string): NavItem | undefined {
  return navGroups
    .flatMap(group => group.items)
    .find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))
}
