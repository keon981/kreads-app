import { Suspense } from 'react'

import { SidebarInset, SidebarProvider } from '@workspace/ui/components/sidebar'
import { Splash, SplashDismiss, SplashProvider } from '@workspace/ui/components/splash'

import Loading from '@/app/loading'
import { getInitialIsMobile } from '@/app/server/device'
import { AppNav, AppNavSkeleton } from '@/components/layout/app-sidebar'
import { Providers } from '@/contexts/providers'
import { verifySession } from '@/lib/auth'

// Request-time providers live here instead of the root layout, so the root 404 for unmatched URLs prerenders as a complete static page
export default function Layout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return (
    <SplashProvider>
      {/* Must stay outside the Suspense, or the splash waits on the session */}
      <Splash>
        <Loading />
      </Splash>
      <Suspense fallback={<Loading />}>
        <RootProviders>
          <SplashDismiss />
          <SidebarProvider>
            <Suspense fallback={<AppNavSkeleton />}>
              <AppNav />
            </Suspense>
            <SidebarInset className="flex-row items-start justify-center gap-4">
              {children}
            </SidebarInset>
          </SidebarProvider>
        </RootProviders>
      </Suspense>
    </SplashProvider>
  )
}

async function RootProviders({ children }: {
  children: React.ReactNode
}): Promise<React.ReactNode> {
  const [initialIsMobile, { status, session }] = await Promise.all([
    getInitialIsMobile(),
    verifySession(),
  ])
  const user = status === 'active' ? session.user : null

  return (
    <Providers
      initialIsMobile={initialIsMobile}
      isAuth={!!user}
      user={user
        ? {
            id: user.username ?? undefined,
            name: user.name,
            image: user.image ?? undefined,
            repoName: user.repoName ?? undefined,
            isPublic: user.isPublic ?? false,
          }
        : null}
    >
      {children}
    </Providers>
  )
}
