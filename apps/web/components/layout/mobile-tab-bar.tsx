'use client'

import React from 'react'

import { Button } from '@workspace/ui/components/button'

import { sidebar } from '@/configs/nav-config'

interface MobileTabBarContainerProps {
  children: React.ReactNode
}

const navItemButtonProps = { variant: 'ghost', size: 'icon-lg' } as const

function MobileTabBarContainer({ children }: MobileTabBarContainerProps): React.ReactNode {
  return (
    <nav
      data-slot="tab-bar"
      className="fixed inset-x-0 bottom-0 z-40 h-14 min-h-14 w-full border-t border-sidebar-border bg-sidebar/95 px-2 text-sidebar-foreground shadow-sm backdrop-blur-md pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex size-full items-center justify-around">
        {children}
      </ul>
    </nav>
  )
}

export function MobileTabBar(): React.ReactNode {
  return (
    <MobileTabBarContainer>
      {sidebar.navMain.map(({ id, NavItem, isLink, isPrimary }) => (
        <li key={id}>
          <NavItem>
            <Button {...navItemButtonProps} variant={isPrimary ? 'secondary' : 'ghost'} nativeButton={!isLink} />
          </NavItem>
        </li>
      ))}
    </MobileTabBarContainer>
  )
}

export function MobileTabBarSkeleton(): React.ReactNode {
  return (
    <MobileTabBarContainer>
      {sidebar.navMain.map(({ id, icon: Icon }) => (
        <li key={id}>
          <Button {...navItemButtonProps}>
            <Icon />
          </Button>
        </li>
      ))}
    </MobileTabBarContainer>
  )
}
