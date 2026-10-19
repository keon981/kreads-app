import { useRouter } from 'next/navigation'

import { useTransition } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { toast } from '@workspace/ui/components/toast'

import { signInWithGitHub, signOutWithClient } from '@/lib/auth-client'

interface AuthActions {
  isPending: boolean
  signIn: () => void
  signOut: () => void
}

export function useAuthActions(): AuthActions {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isPending, startTransition] = useTransition()

  const signIn = (): void => {
    startTransition(async () => {
      const toastId = toast.add({
        type: 'loading',
        description: '正在前往 GitHub 登入...',
      })

      // throw Network error
      const res = await signInWithGitHub().catch(() => null)

      if (res?.error) {
        toast.update(toastId, {
          type: 'error',
          description: res?.error?.message || '登入失敗，請稍後再試',
          timeout: 5000,
        })
      }
    })
  }

  const signOut = (): void => {
    startTransition(async () => {
      const toastId = toast.add({
        type: 'loading',
        description: '正在登出...',
      })

      const res = await signOutWithClient().catch(() => null)
      if (!res || res.error) {
        toast.update(toastId, {
          type: 'error',
          description: res?.error?.message || '登出失敗，請稍後再試',
          timeout: 5000,
        })
        return
      }

      queryClient.clear()
      router.refresh()
      toast.update(toastId, {
        type: 'success',
        description: '已登出',
        timeout: 5000,
      })
    })
  }

  return { isPending, signIn, signOut }
}
