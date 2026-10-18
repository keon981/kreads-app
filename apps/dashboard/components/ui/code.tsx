import React from 'react'

import { cn } from '@workspace/ui/lib/utils'

function Code({ className, ...props }: React.ComponentProps<'code'>) {
  return (
    <code className={cn('shrink-0 rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs', className)} {...props} />
  )
}

export default Code
