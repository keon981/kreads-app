import { useAuth } from '@/contexts/auth-provider'
import { useSignInDialog } from '@/store/sign-in-dialog'

import type { BaseUIEvent } from '@base-ui/react/types'

type AuthGuardClickEvent = BaseUIEvent<React.MouseEvent<HTMLButtonElement>>

export function useAuthGuard(callback?: (event: AuthGuardClickEvent) => void): (event: AuthGuardClickEvent) => void {
  const { isAuth } = useAuth()
  const triggerSignInDialog = useSignInDialog(state => state.trigger)

  return (event: AuthGuardClickEvent): void => {
    if (!isAuth) {
      event.preventDefault()
      event.preventBaseUIHandler()
      triggerSignInDialog()
      return
    }
    callback?.(event)
  }
}
