import { fetchUsers, fetchUsersCache } from '@/app/server/db/users'
import { getAudience, getSession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'

import { UsersTable } from './table'

export default async function UsersPage(): Promise<React.ReactNode> {
  const session = await getSession()
  const audience = getAudience(session)
  const users = audience === 'admin'
    ? await fetchUsers(audience)
    : await fetchUsersCache(audience)

  return (
    <SectionPageLayout fill title="使用者管理" description="檢視主站使用者，管理分組、停權狀態與登入裝置。">
      <UsersTable users={users} isAdmin={audience === 'admin'} />
    </SectionPageLayout>
  )
}
