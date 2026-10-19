import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { DeviceProvider } from '@workspace/ui/contexts/device-provider'

import { getInitialIsMobile } from '@/app/server/device'
import { getSession } from '@/app/server/session'
import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default async function PagesLayout({
  children,
}: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  // Request-time reads stay out of the root layout so the 404 page prerenders as static HTML
  const [initialIsMobile, session] = await Promise.all([getInitialIsMobile(), getSession()])
  const user = session?.user ?? null

  return (
    <DeviceProvider initialIsMobile={initialIsMobile}>
      <SidebarProvider
        defaultOpen
        className="flex-col"
        style={{
          '--sidebar-width': '16rem',
          '--sidebar-width-icon': '3.5rem',
          '--header-height': '4.5rem',
        } as React.CSSProperties}
      >
        <AppHeader user={user} />
        <div className="flex flex-1">
          <AppSidebar user={user} />
          <SidebarInset className="min-w-0 max-md:pb-14">
            {children}
          </SidebarInset>
        </div>
      </SidebarProvider>
    </DeviceProvider>
  )
}
