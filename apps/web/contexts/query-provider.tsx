'use client'

import { useEffect } from 'react'

import { QueryClientProvider } from '@tanstack/react-query'

import { toast } from '@workspace/ui/components/toast'

import { getQueryClient } from '@/lib/query-client'

function QueryProvider({ children }: { children: React.ReactNode }): React.ReactNode {
  const queryClient = getQueryClient()

  useEffect(() => queryClient.getMutationCache().subscribe((event) => {
    if (event.type !== 'updated' || event.action.type !== 'error') return
    toast.add({ type: 'error', description: event.action.error.message })
  }), [queryClient])

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

export { QueryProvider }
