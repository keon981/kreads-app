import { mergeProps, useRender } from '@base-ui/react'

import { cn } from '@/lib/utils'

function Skeleton({ className, render, ...props }: useRender.ComponentProps<'div'>) {
  return useRender({
    defaultTagName: 'div',
    props: mergeProps<'div'>({
      className: cn('animate-pulse rounded-md bg-muted', className),
    }, props),
    render,
    state: {
      slot: 'badge',
    },
  })
}

export { Skeleton }
