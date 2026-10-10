import { hasRole } from '@workspace/server/auth/access'

import { fetchUsers } from '@/app/server/db/users'
import { verifySession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'

import { UsersTable } from './table'

export default async function UsersPage(): Promise<React.ReactNode> {
  const { user } = await verifySession()
  const isAdmin = hasRole(user.role, 'admin')
  const users = await fetchUsers(isAdmin)

  return (
    <SectionPageLayout title="使用者管理" description="檢視主站使用者，管理停權狀態與登入裝置。">
      <UsersTable users={users} isAdmin={isAdmin} />
    </SectionPageLayout>
  )
}
