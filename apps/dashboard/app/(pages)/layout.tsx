import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { verifySession } from '@/app/server/session'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  const { user } = await verifySession()

  return (
    <SidebarProvider
      defaultOpen
      style={{ '--sidebar-width': '16rem', '--sidebar-width-icon': '3.5rem' } as React.CSSProperties}
    >
      <AppSidebar user={user} />
      <SidebarInset className="min-w-0">
        <AppHeader user={user} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
