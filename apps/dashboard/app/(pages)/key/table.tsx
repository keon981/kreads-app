'use client'

import { useState, useTransition } from 'react'

import { useTable } from '@tanstack/react-table'

import { RiDeleteBinLine, RiFileCopyLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { toast } from '@workspace/ui/components/toast'
import { useCopy } from '@workspace/ui/hooks/use-copy'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { ConfirmDialog } from '@/components/blocks/confirm-dialog'
import { dataTableFeatures } from '@/components/blocks/data-table'
import { defaultRole } from '@/configs/auth-config'
import { DataTableView } from '@/views/data-table-view'
import { RoleEditSheet } from '@/views/role-edit-sheet'

import { deleteInvitesAction, updateInviteAction } from './action'
import { getInviteColumns } from './columns'
import { filterFields, getDeleteConfirmMessage } from './data'

import type { InviteRow } from '@/types/invite'

interface InvitesTableProps {
  invites: InviteRow[]
  isAdmin: boolean
}

export function InvitesTable({ invites, isAdmin }: InvitesTableProps): React.ReactNode {
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
      <DataTableView
        table={table}
        filterFields={filterFields}
        filterLabel="篩選邀請碼"
        emptyText="沒有符合條件的邀請碼"
        itemLabel="個邀請碼"
        bulkActions={(
          <>
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
          </>
        )}
      />

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

      <ConfirmDialog
        {...deleteDialogProps}
        message={getDeleteConfirmMessage(deleteTargets)}
        isPending={isPending}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
