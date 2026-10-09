import type { SetStateAction } from 'react'

import { create } from 'zustand'

interface SignInDialogState {
  open: boolean
  trigger: () => void
  dismiss: () => void
  setOpen: (action: SetStateAction<boolean>) => void
  toggle: () => void
}

export const useSignInDialog = create<SignInDialogState>()(set => ({
  open: false,
  trigger: () => set({ open: true }),
  dismiss: () => set(() => ({ open: false })),
  setOpen: action =>
    set(state => ({
      open: typeof action === 'function' ? action(state.open) : action,
    })),
  toggle: () => set(state => ({ open: !state.open })),
}))
