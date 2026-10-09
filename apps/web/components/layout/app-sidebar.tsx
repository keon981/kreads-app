'use client'

import React from 'react'

import { useIsMobile } from '@workspace/ui/hooks/use-mobile'

import { DesktopSidebar, DesktopSidebarSkeleton } from '@/components/layout/desktop-sidebar'
import { MobileTabBar, MobileTabBarSkeleton } from '@/components/layout/mobile-tab-bar'

import type { Sidebar } from '@workspace/ui/components/sidebar'

export function AppNav(props: React.ComponentProps<typeof Sidebar>): React.ReactNode {
  const isMobile = useIsMobile()

  return isMobile ? <MobileTabBar /> : <DesktopSidebar {...props} />
}

export function AppNavSkeleton(): React.ReactNode {
  const isMobile = useIsMobile()

  return isMobile ? <MobileTabBarSkeleton /> : <DesktopSidebarSkeleton />
}
