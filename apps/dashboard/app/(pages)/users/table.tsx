'use client'

import { useState, useTransition } from 'react'

import { useTable } from '@tanstack/react-table'

import { toast } from '@workspace/ui/components/toast'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { ConfirmDialog } from '@/components/blocks/confirm-dialog'
import { dataTableFeatures } from '@/components/blocks/data-table'
import { defaultRole } from '@/configs/auth-config'
import { DataTableView } from '@/views/data-table-view'
import { RoleEditSheet } from '@/views/role-edit-sheet'

import { updateUserAction, updateUserRoleAction } from './action'
import { getUserColumns } from './columns'
import { actionSuccessTitles, filterFields, getActionConfirmMessage } from './data'

import type { UserActionType, UserRow } from '@/types/user'
import type { ConfirmActionType } from './data'

interface PendingAction {
  type: ConfirmActionType
  user: UserRow
}

interface UsersTableProps {
  users: UserRow[]
  isAdmin: boolean
}

export function UsersTable({ users, isAdmin }: UsersTableProps): React.ReactNode {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const [editTarget, setEditTarget] = useState<UserRow | null>(null)
  const { dialogProps: confirmDialogProps, trigger: openConfirm, dismiss: closeConfirm } = useDialog()
  const { dialogProps: editSheetProps, trigger: openEditSheet, dismiss: closeEditSheet } = useDialog()
  const [isPending, startTransition] = useTransition()

  function runAction(type: UserActionType, user: UserRow): void {
    if (!user.id) return
    const userId = user.id

    startTransition(async () => {
      const { message } = await updateUserAction(type, userId)
      closeConfirm()
      if (message) {
        toast.add({ title: '操作失敗', description: message, type: 'error' })
        return
      }
      toast.add({ title: actionSuccessTitles[type], description: user.name, type: 'success' })
    })
  }

  const columns = getUserColumns({
    isAdmin,
    onEdit: (user) => {
      setEditTarget(user)
      openEditSheet()
    },
    onAction: (type, user) => {
      if (type === 'ban' || type === 'remove') {
        setPendingAction({ type, user })
        openConfirm()
      } else {
        runAction(type, user)
      }
    },
  })

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: users,
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  return (
    <>
      <DataTableView
        table={table}
        filterFields={filterFields}
        filterLabel="篩選使用者"
        emptyText="沒有符合條件的使用者"
      />

      <RoleEditSheet
        {...editSheetProps}
        title="編輯使用者"
        description="變更使用者在主站的權限分組。"
        formKey={editTarget?.id}
        fields={[
          { label: '名稱', value: editTarget?.name ?? '' },
          { label: 'Username', value: editTarget?.username ?? '未完成註冊' },
        ]}
        role={editTarget?.role ?? defaultRole}
        action={updateUserRoleAction.bind(null, editTarget?.id ?? '')}
        onSuccess={() => {
          closeEditSheet()
          toast.add({ title: '已更新分組', description: editTarget?.name, type: 'success' })
        }}
      />

      <ConfirmDialog
        {...confirmDialogProps}
        message={pendingAction && getActionConfirmMessage(pendingAction.type, pendingAction.user)}
        isPending={isPending}
        onConfirm={() => pendingAction && runAction(pendingAction.type, pendingAction.user)}
      />
    </>
  )
}
