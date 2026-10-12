'use client'

import React from 'react'

import { Button } from '@workspace/ui/components/button'
import { TabBar, TabBarItem } from '@workspace/ui/components/tab-bar'

import { sidebar } from '@/configs/nav-config'

const navItemButtonProps = { variant: 'ghost', size: 'icon-lg' } as const

export function MobileTabBar(): React.ReactNode {
  return (
    <TabBar>
      {sidebar.navMain.map(({ id, NavItem, isLink, isPrimary }) => (
        <TabBarItem key={id}>
          <NavItem>
            <Button {...navItemButtonProps} variant={isPrimary ? 'secondary' : 'ghost'} nativeButton={!isLink} />
          </NavItem>
        </TabBarItem>
      ))}
    </TabBar>
  )
}

export function MobileTabBarSkeleton(): React.ReactNode {
  return (
    <TabBar>
      {sidebar.navMain.map(({ id, icon: Icon }) => (
        <TabBarItem key={id}>
          <Button {...navItemButtonProps}>
            <Icon />
          </Button>
        </TabBarItem>
      ))}
    </TabBar>
  )
}
