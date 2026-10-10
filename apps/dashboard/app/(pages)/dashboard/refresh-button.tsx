'use client'

import { useRouter } from 'next/navigation'

import { useTransition } from 'react'

import { RiRefreshLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'

export function RefreshButton(): React.ReactNode {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(() => router.refresh())
  }

  return (
    <Button variant="outline" disabled={isPending} onClick={handleRefresh}>
      {isPending
        ? <Spinner data-icon="inline-start" />
        : <RiRefreshLine data-icon="inline-start" />}
      重新整理
    </Button>
  )
}
