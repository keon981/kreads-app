import { useRouter } from 'next/navigation'

import { useOptimistic, useTransition } from 'react'

import { toast } from '@workspace/ui/components/toast'

import { updateVisibilityAction } from '@/app/server/actions/user'
import { useAuth } from '@/contexts/auth-provider'

interface Visibility {
  isPublic: boolean
  isPending: boolean
  setIsPublic: (isPublic: boolean) => void
}

export function useVisibility(): Visibility {
  const router = useRouter()
  const { user } = useAuth()
  const [isPending, startTransition] = useTransition()
  const [isPublic, setOptimisticIsPublic] = useOptimistic(user?.isPublic ?? false)

  const setIsPublic = (nextIsPublic: boolean): void => {
    startTransition(async () => {
      setOptimisticIsPublic(nextIsPublic)
      const { message } = await updateVisibilityAction(nextIsPublic)
      if (message) {
        toast.add({ type: 'error', description: message })
        return
      }
      router.refresh()
    })
  }

  return { isPublic, isPending, setIsPublic }
}
