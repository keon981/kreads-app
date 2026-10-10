import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default function PagesLayout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <SidebarProvider
      defaultOpen
      style={{ '--sidebar-width': '16rem', '--sidebar-width-icon': '3.5rem' } as React.CSSProperties}
    >
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
