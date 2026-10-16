import { Suspense } from 'react'

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { AppNav, AppNavSkeleton } from '@/components/layout/app-sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppNavSkeleton />}>
        <AppNav />
      </Suspense>
      <SidebarInset className="flex-row items-start justify-center gap-4">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
