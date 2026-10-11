import { hasRole } from '@workspace/server/auth/access'

import { fetchInvites } from '@/app/server/db/invites'
import { verifySession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'

import { CreateInviteDialog } from './create-dialog'
import { InvitesTable } from './table'

export default async function InvitesPage(): Promise<React.ReactNode> {
  const { user } = await verifySession()
  const isAdmin = hasRole(user.role, 'admin')
  const invites = await fetchInvites(isAdmin)

  return (
    <SectionPageLayout
      title="邀請碼"
      actions={isAdmin && <CreateInviteDialog />}
    >
      <InvitesTable invites={invites} isAdmin={isAdmin} />
    </SectionPageLayout>
  )
}
