import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex-row items-start justify-center gap-4">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
