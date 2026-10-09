import { Suspense } from 'react'

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { AppNav, AppNavSkeleton } from '@/components/layout/app-sidebar'
import { AuthProvider } from '@/contexts/auth-provider'
import { ThemeProvider } from '@/contexts/theme-provider'

export function Providers({
  children,
  ...props
}: React.ComponentProps<typeof AuthProvider>): React.ReactNode {
  return (
    <ThemeProvider>
      <AuthProvider {...props}>
        <SidebarProvider>
          <Suspense fallback={<AppNavSkeleton />}>
            <AppNav />
          </Suspense>
          <SidebarInset className="flex-row items-start justify-center gap-4">
            {children}
          </SidebarInset>
        </SidebarProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
