import { redirect } from 'next/navigation'

import { AuthRedirect } from '@/components/auth/auth-redirect'
import { homePageUrl } from '@/configs/nav-config'
import { verifySession } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export async function AuthGuard({ children }: AuthGuardProps): Promise<React.ReactNode> {
  const { status } = await verifySession()
  if (status === 'signed-out') return <AuthRedirect target="sign-in" />
  if (status === 'unregistered') return <AuthRedirect target="sign-up" />

  return children
}

interface GuestOnlyRouteProps {
  children: React.ReactNode
}

export async function GuestOnlyRoute({ children }: GuestOnlyRouteProps): Promise<React.ReactNode> {
  const { status } = await verifySession()
  if (status === 'active') redirect(homePageUrl)

  return children
}
