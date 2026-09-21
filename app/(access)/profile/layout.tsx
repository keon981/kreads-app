import { verifySession } from '@/lib/auth'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  await verifySession('/profile')

  return <>{children} </>
}
