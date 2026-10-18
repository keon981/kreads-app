'use client'

import { usePathname } from 'next/navigation'

import { useTransition } from 'react'

import { RiLogoutBoxRLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'

import { signOutAction } from '@/app/server/actions/auth'

export function LogoutButton(): React.ReactNode {
  const isMobile = useIsMobile()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  if (!isMobile) return null

  const handleLogout = (): void => {
    startTransition(() => signOutAction(pathname))
  }

  return (
    <Button
      variant="destructive"
      size="lg"
      className="w-full"
      disabled={isPending}
      onClick={handleLogout}
    >
      {isPending
        ? <Spinner data-icon="inline-start" />
        : <RiLogoutBoxRLine data-icon="inline-start" />}
      登出
    </Button>
  )
}
