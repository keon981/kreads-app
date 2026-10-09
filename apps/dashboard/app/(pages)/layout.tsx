import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'

import { AppHeader } from '@/components/layout/app-header'
import { AppSidebar } from '@/components/layout/app-sidebar'

// Override the apps/web sizing baked into packages/ui SIDEBAR_CONFIG
const sidebarStyle = {
  '--sidebar-width': '16rem',
  '--sidebar-width-icon': '3.5rem',
} as React.CSSProperties

export default function PagesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>): React.ReactNode {
  return (
    <SidebarProvider defaultOpen style={sidebarStyle}>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <AppHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
