'use client'

import { useState, useTransition } from 'react'

import { useTable } from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { RiDeleteBinLine, RiFileCopyLine, RiSearchLine } from '@remixicon/react'
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
import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/components/toast'
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import {
  DataTable,
  DataTableBulkBar,
  dataTableFeatures,
  DataTableFilterForm,
  DataTablePagination,
  DataTableSelectFilter,
  DataTableTextFilter,
} from '@/components/blocks/data-table'
import { RoleEditSheet } from '@/components/blocks/role-edit-sheet'
import { defaultRole, roleOptions } from '@/configs/auth-config'

import { deleteInvitesAction, updateInviteAction } from './action'
import { getInviteColumns, inviteStatusLabels } from './columns'

import type { InviteFilterValues, InviteRow, InviteStatus, InviteStatusFilter } from '@/types/invite'
import type { OptionItem } from '@/types/option'
import type { AssignableRoleFilter } from '@/types/user'

const emptyFilters: InviteFilterValues = { code: '', role: 'all', status: 'all' }

const roleFilterOptions: OptionItem<AssignableRoleFilter>[] = [{ label: '全部分組', value: 'all' }, ...roleOptions]

function getColumnFilters(filters: InviteFilterValues): ColumnFiltersState {
  const columnFilters: ColumnFiltersState = []

  if (filters.code.trim())
    columnFilters.push({ id: 'code', value: filters.code.trim() })
  if (filters.role !== 'all')
    columnFilters.push({ id: 'role', value: filters.role })
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
  const [deleteTargets, setDeleteTargets] = useState<InviteRow[]>([])
  const [editTarget, setEditTarget] = useState<InviteRow | null>(null)
  const { dialogProps: deleteDialogProps, trigger: openDeleteDialog, dismiss: closeDeleteDialog } = useDialog()
  const { dialogProps: editSheetProps, trigger: openEditSheet, dismiss: closeEditSheet } = useDialog()
  const [isPending, startTransition] = useTransition()

  const table = useTable({
    features: dataTableFeatures,
    columns: getInviteColumns({
      isAdmin,
      onEdit: (invite) => {
        setEditTarget(invite)
        openEditSheet()
      },
      onDelete: invite => openDeleteConfirm([invite]),
    }),
    data: invites,
    getRowId: invite => invite.id ?? invite.code,
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const selectedIds = table.getSelectedRowIds()
  const selectedInvites = invites.filter(invite => invite.id && selectedIds.includes(invite.id))
  const [, copyCodes] = useCopy({ successMessage: `已複製 ${selectedInvites.length} 個邀請碼` })

  const deletableCount = deleteTargets.filter(invite => invite.status === 'unused').length
  const keptCount = deleteTargets.length - deletableCount
  const deleteDescription = deleteTargets.length === 1
    ? `邀請碼「${deleteTargets[0].code}」將被永久刪除，刪除後無法再用來註冊。此操作無法復原。`
    : `將永久刪除 ${deletableCount} 個未使用的邀請碼${keptCount > 0 ? `，已核銷的 ${keptCount} 個會保留` : ''}。此操作無法復原。`

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

  function openDeleteConfirm(targets: InviteRow[]): void {
    setDeleteTargets(targets)
    openDeleteDialog()
  }

  function handleConfirmDelete(): void {
    const inviteIds = deleteTargets.flatMap(invite => (invite.status === 'unused' && invite.id ? [invite.id] : []))
    if (inviteIds.length === 0) return

    startTransition(async () => {
      const { message, count } = await deleteInvitesAction(inviteIds)
      closeDeleteDialog()
      if (message) {
        toast.add({ title: '刪除失敗', description: message, type: 'error' })
        return
      }
      table.resetRowSelection()
      toast.add({ title: `已刪除 ${count} 個邀請碼`, type: 'success' })
    })
  }

  return (
    <>
      <DataTableFilterForm aria-label="篩選邀請碼" onSubmit={handleSearch} onReset={handleResetFilters}>
        <DataTableTextFilter
          label="邀請碼"
          icon={<RiSearchLine />}
          value={filters.code}
          onValueChange={code => setFilters(previous => ({ ...previous, code }))}
        />
        <DataTableSelectFilter
          label="分組"
          options={roleFilterOptions}
          value={filters.role}
          onValueChange={role => setFilters(previous => ({ ...previous, role }))}
        />
        <DataTableSelectFilter
          label="狀態"
          options={statusOptions}
          value={filters.status}
          onValueChange={status => setFilters(previous => ({ ...previous, status }))}
        />
      </DataTableFilterForm>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <DataTable table={table} emptyText="沒有符合條件的邀請碼" />
        <DataTablePagination table={table} />
        <DataTableBulkBar table={table} itemLabel="個邀請碼">
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full"
            aria-label="複製選取的邀請碼"
            onClick={() => copyCodes(selectedInvites.map(invite => invite.code).join('\n'))}
          >
            <RiFileCopyLine />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
            disabled={!selectedInvites.some(invite => invite.status === 'unused')}
            aria-label="刪除選取的邀請碼"
            onClick={() => openDeleteConfirm(selectedInvites)}
          >
            <RiDeleteBinLine />
          </Button>
        </DataTableBulkBar>
      </div>

      <RoleEditSheet
        {...editSheetProps}
        title="編輯邀請碼"
        description="未使用的邀請碼會在註冊時套用分組；已核銷的會直接變更核銷人的分組。"
        formKey={editTarget?.id}
        fields={[{ label: '名稱', value: editTarget?.code ?? '' }]}
        role={editTarget?.role ?? defaultRole}
        action={updateInviteAction.bind(null, editTarget?.id ?? '')}
        onSuccess={() => {
          closeEditSheet()
          toast.add({ title: '已更新分組', description: editTarget?.code, type: 'success' })
        }}
      />

      <AlertDialog {...deleteDialogProps}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <RiDeleteBinLine />
            </AlertDialogMedia>
            <AlertDialogTitle>確定要刪除邀請碼嗎？</AlertDialogTitle>
            <AlertDialogDescription>{deleteDescription}</AlertDialogDescription>
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
