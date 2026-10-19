import { GuestOnlyRoute } from '@/components/auth/auth-guard'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}): React.ReactNode {
  return <GuestOnlyRoute>{children}</GuestOnlyRoute>
}
