'use client'

import { DialogTrigger } from '@workspace/ui/components/dialog'

import { useAuthGuard } from '@/hooks/use-auth-guard'

export function AuthDialogTrigger({ onClick, ...props }: React.ComponentProps<typeof DialogTrigger>): React.ReactNode {
  const onAuthGuardClick = useAuthGuard(onClick)
  return <DialogTrigger onClick={onAuthGuardClick} {...props} />
}
