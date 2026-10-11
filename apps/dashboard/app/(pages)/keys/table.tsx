'use client'

import { useState, useTransition } from 'react'

import { useTable } from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { RiDeleteBinLine, RiStickyNoteLine } from '@remixicon/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import { toast } from '@workspace/ui/components/toast'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import {
  DataTable,
  dataTableFeatures,
  DataTableFilterForm,
  DataTablePagination,
  DataTableSelectFilter,
  DataTableTextFilter,
} from '@/components/ui/data-table'

import { deleteInviteAction } from './action'
import { getInviteColumns } from './columns'
import { inviteStatusLabels } from './utils'

import type { OptionItem } from '@/types/option'
import type { InviteFilterValues, InviteRow, InviteStatus, InviteStatusFilter } from './types'

const emptyFilters: InviteFilterValues = { note: '', status: 'all' }

function getColumnFilters(filters: InviteFilterValues): ColumnFiltersState {
  const columnFilters: ColumnFiltersState = []

  if (filters.note.trim())
    columnFilters.push({ id: 'note', value: filters.note.trim() })
  if (filters.status !== 'all')
    columnFilters.push({ id: 'status', value: filters.status })

  return columnFilters
}

interface InvitesTableProps {
  invites: InviteRow[]
  isAdmin: boolean
}

export function InvitesTable({ invites, isAdmin }: InvitesTableProps): React.ReactNode {
  const [filters, setFilters] = useState<InviteFilterValues>(emptyFilters)
  const [deleteTarget, setDeleteTarget] = useState<InviteRow | null>(null)
  const { dialogProps: deleteDialogProps, trigger: openDeleteDialog, dismiss: closeDeleteDialog } = useDialog()
  const [isPending, startTransition] = useTransition()

  const table = useTable({
    features: dataTableFeatures,
    columns: getInviteColumns({
      isAdmin,
      onDelete: (invite) => {
        setDeleteTarget(invite)
        openDeleteDialog()
      },
    }),
    data: invites,
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const statusOptions: OptionItem<InviteStatusFilter>[] = [
    { label: '全部狀態', value: 'all' },
    ...(Object.keys(inviteStatusLabels) as InviteStatus[]).map(status => ({ label: inviteStatusLabels[status], value: status })),
  ]

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    table.setColumnFilters(getColumnFilters(filters))
    table.setPageIndex(0)
  }

  function handleResetFilters(): void {
    setFilters(emptyFilters)
    table.resetColumnFilters()
    table.setPageIndex(0)
  }

  function handleConfirmDelete(): void {
    if (!deleteTarget?.id) return
    const inviteId = deleteTarget.id

    startTransition(async () => {
      const { message } = await deleteInviteAction(inviteId)
      closeDeleteDialog()
      toast.add(message
        ? { title: '刪除失敗', description: message, type: 'error' }
        : { title: '已刪除邀請碼', type: 'success' })
    })
  }

  return (
    <>
      <DataTableFilterForm aria-label="篩選邀請碼" onSubmit={handleSearch} onReset={handleResetFilters}>
        <DataTableTextFilter
          label="備註"
          icon={<RiStickyNoteLine />}
          value={filters.note}
          onValueChange={note => setFilters(previous => ({ ...previous, note }))}
        />
        <DataTableSelectFilter
          label="狀態"
          options={statusOptions}
          value={filters.status}
          onValueChange={status => setFilters(previous => ({ ...previous, status }))}
        />
      </DataTableFilterForm>

      <div className="flex min-w-0 flex-col gap-3">
        <DataTable table={table} emptyText="沒有符合條件的邀請碼" />
        <DataTablePagination table={table} />
      </div>

      <AlertDialog {...deleteDialogProps}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <RiDeleteBinLine />
            </AlertDialogMedia>
            <AlertDialogTitle>確定要刪除邀請碼嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              {`邀請碼「${deleteTarget?.code}」將被永久刪除，刪除後無法再用來註冊。此操作無法復原。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={isPending} onClick={handleConfirmDelete}>
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
