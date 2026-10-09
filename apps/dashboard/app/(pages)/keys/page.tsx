import { SectionPageLayout } from '@/components/blocks/section-page-layout'
import { KeysActions } from '@/views/apps/keys/keys-actions'
import { KeysProvider } from '@/views/apps/keys/keys-provider'
import { KeysTable } from '@/views/apps/keys/keys-table'
import { KeysToolbar } from '@/views/apps/keys/keys-toolbar'
import { TokenDeleteDialog } from '@/views/apps/keys/token-delete-dialog'
import { TokenFormSheet } from '@/views/apps/keys/token-form-sheet'

export default function KeysPage(): React.ReactNode {
  return (
    <KeysProvider>
      <SectionPageLayout
        title="令牌管理"
        description="建立與管理 API 令牌，控制每個令牌的額度、分組與有效期限。"
        actions={<KeysActions />}
      >
        <KeysToolbar />
        <KeysTable />
      </SectionPageLayout>
      <TokenFormSheet />
      <TokenDeleteDialog />
    </KeysProvider>
  )
}
