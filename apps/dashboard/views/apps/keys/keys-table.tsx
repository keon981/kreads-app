'use client'

import { DataTable, DataTablePagination } from '@/views/apps/keys/data-table'
import { useKeys } from '@/views/apps/keys/keys-context'
import { PAGE_SIZE_OPTIONS } from '@/views/apps/keys/token-config'

export function KeysTable(): React.ReactNode {
  const { table } = useKeys()

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DataTable table={table} emptyText="沒有符合條件的令牌" />
      <DataTablePagination table={table} pageSizeOptions={PAGE_SIZE_OPTIONS} />
    </div>
  )
}
