'use client'

import { useTransition } from 'react'

import { RiAddLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Spinner } from '@workspace/ui/components/spinner'
import { toast } from '@workspace/ui/components/toast'

import { createInviteAction } from './action'

export function CreateInviteButton(): React.ReactNode {
  const [isPending, startTransition] = useTransition()

  function handleCreate(): void {
    startTransition(async () => {
      const { message } = await createInviteAction()
      toast.add(message
        ? { title: '建立失敗', description: message, type: 'error' }
        : { title: '已建立邀請碼', type: 'success' })
    })
  }

  return (
    <Button disabled={isPending} onClick={handleCreate}>
      {isPending ? <Spinner data-icon="inline-start" /> : <RiAddLine data-icon="inline-start" />}
      建立邀請碼
    </Button>
  )
}
