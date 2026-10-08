'use client'

import React from 'react'

import { DesktopSidebar, DesktopSidebarSkeleton } from '@/components/layout/desktop-sidebar'
import { MobileTabBar, MobileTabBarSkeleton } from '@/components/layout/mobile-tab-bar'
import { useIsMobile } from '@/hooks/use-mobile'

import type { Sidebar } from '@/components/ui/sidebar'

export function AppNav(props: React.ComponentProps<typeof Sidebar>): React.ReactNode {
  const isMobile = useIsMobile()

  return isMobile ? <MobileTabBar /> : <DesktopSidebar {...props} />
}

export function AppNavSkeleton(): React.ReactNode {
  const isMobile = useIsMobile()

  return isMobile ? <MobileTabBarSkeleton /> : <DesktopSidebarSkeleton />
}
