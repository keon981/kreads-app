'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Button } from '@workspace/ui/components/button'
import { TabBar, TabBarItem } from '@workspace/ui/components/tab-bar'

import { getActiveNavItem, navGroups } from '@/configs/nav-config'

const navItems = navGroups.flatMap(group => group.items)

export function MobileTabBar(): React.ReactNode {
  const pathname = usePathname()
  const activeItem = getActiveNavItem(pathname)

  return (
    <TabBar>
      {navItems.map(({ title, href, icon: Icon }) => {
        const isActive = activeItem?.href === href

        return (
          <TabBarItem key={href}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="icon-lg"
              nativeButton={false}
              aria-label={title}
              aria-current={isActive ? 'page' : undefined}
              render={<Link href={href} />}
            >
              <Icon />
            </Button>
          </TabBarItem>
        )
      })}
    </TabBar>
  )
}
