'use client'

import Link from 'next/link'

import React from 'react'

import { useRender } from '@base-ui/react/use-render'

import { NoticeAlertDialog } from '@/components/blocks/confirm-dialog'
import { DialogTrigger } from '@/components/ui/dialog'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'

export interface NavItemProps {
  children: React.ReactElement
}

interface LinkNavItemProps extends NavItemProps {
  href: string
  label: string
  isActive: boolean
  icon: React.ReactNode
  requireAuth?: boolean
}

interface NoticeNavItemProps extends NavItemProps {
  label: string
  description: string
  icon: React.ReactNode
}

export function LinkNavItem({
  children,
  href,
  label,
  isActive,
  icon,
  requireAuth = false,
}: LinkNavItemProps): React.ReactNode {
  const { isAuth } = useAuth()
  const onAuthGuardClick = useAuthGuard()

  // The guard calls preventDefault when signed out, which makes next/link skip navigation.
  return useRender({
    render: children,
    props: {
      'render': <Link href={href} prefetch={requireAuth ? isAuth : undefined} />,
      'onClick': requireAuth ? onAuthGuardClick : undefined,
      'aria-label': label,
      'children': icon,
    },
    state: { active: isActive },
  })
}

export function NoticeNavItem({
  children,
  label,
  description,
  icon,
}: NoticeNavItemProps): React.ReactNode {
  return (
    <NoticeAlertDialog title="功能尚未開放" description={description}>
      <DialogTrigger render={children} aria-label={label}>
        {icon}
      </DialogTrigger>
    </NoticeAlertDialog>
  )
}
