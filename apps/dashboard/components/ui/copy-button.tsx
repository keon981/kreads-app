'use client'

import { RiCheckLine, RiFileCopyLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { useCopyLink } from '@workspace/ui/hooks/use-copy-link'

interface CopyButtonProps extends Omit<React.ComponentProps<typeof Button>, 'onClick' | 'children'> {
  text: string
  successMessage?: string
}

export function CopyButton({
  text,
  successMessage,
  variant = 'ghost',
  size = 'icon-sm',
  ...props
}: CopyButtonProps): React.ReactNode {
  const { copied, copy } = useCopyLink({ successMessage })

  return (
    <Button variant={variant} size={size} onClick={() => copy(text)} {...props}>
      {copied ? <RiCheckLine /> : <RiFileCopyLine />}
    </Button>
  )
}
