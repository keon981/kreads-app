import { redirect } from 'next/navigation'

import { getSessionCache } from '@/lib/auth'
import { isUserActive } from '@/utils/user'

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionCache()
  if (isUserActive(session)) redirect('/')

  return <>{children} </>
}
