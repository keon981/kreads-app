import { fetchCachedInvites, fetchInvites } from '@/app/server/db/invites'
import { getAudience, getSession } from '@/app/server/session'
import { SectionPageLayout } from '@/components/layout/section-page-layout'

import { CreateInviteButton } from './create-button'
import { InvitesTable } from './table'

export default async function InvitesPage(): Promise<React.ReactNode> {
  const session = await getSession()
  const audience = getAudience(session)
  const isAdmin = audience === 'admin'
  const invites = isAdmin
    ? await fetchInvites(audience)
    : await fetchCachedInvites(audience)

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
