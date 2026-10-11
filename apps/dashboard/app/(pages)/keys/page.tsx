import { hasRole } from '@workspace/server/auth/access'

import { fetchInvites } from '@/app/server/db/invites'
import { verifySession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'

import { CreateInviteButton } from './create-button'
import { InvitesTable } from './table'

export default async function InvitesPage(): Promise<React.ReactNode> {
  const { user } = await verifySession()
  const isAdmin = hasRole(user.role, 'admin')
  const invites = await fetchInvites(isAdmin)

  return (
    <SectionPageLayout
      fill
      title="邀請碼"
      actions={isAdmin && <CreateInviteButton />}
    >
      <InvitesTable invites={invites} isAdmin={isAdmin} />
    </SectionPageLayout>
  )
}
