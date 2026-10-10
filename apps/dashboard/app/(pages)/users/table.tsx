'use client'

import { useState, useTransition } from 'react'

import { useTable } from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'

import { RiAtLine, RiDeleteBinLine, RiForbidLine, RiSearchLine } from '@remixicon/react'
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

import { updateUserAction } from './action'
import { getUserColumns } from './columns'
import { userStatusLabels } from './utils'

import type { OptionItem } from '@/types/option'
import type { UserActionType, UserFilterValues, UserRow, UserStatus, UserStatusFilter } from './types'

const emptyFilters: UserFilterValues = { name: '', username: '', status: 'all' }

function getColumnFilters(filters: UserFilterValues): ColumnFiltersState {
  const columnFilters: ColumnFiltersState = []

  if (filters.name.trim())
    columnFilters.push({ id: 'name', value: filters.name.trim() })
  if (filters.username.trim())
    columnFilters.push({ id: 'username', value: filters.username.trim() })
  if (filters.status !== 'all')
    columnFilters.push({ id: 'status', value: filters.status })

  return columnFilters
}

interface PendingAction {
  type: Extract<UserActionType, 'ban' | 'remove'>
  user: UserRow
}

interface UsersTableProps {
  users: UserRow[]
  isAdmin: boolean
}

export function UsersTable({ users, isAdmin }: UsersTableProps): React.ReactNode {
  const [filters, setFilters] = useState<UserFilterValues>(emptyFilters)
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null)
  const { dialogProps: confirmDialogProps, trigger: openConfirm, dismiss: closeConfirm } = useDialog()
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
      const successTitles: Record<UserActionType, string> = {
        ban: '已停權',
        unban: '已解除停權',
        revoke: '已撤銷所有登入',
        remove: '已刪除使用者',
      }
      toast.add({ title: successTitles[type], description: user.name, type: 'success' })
    })
  }

  const columns = getUserColumns({
    isAdmin,
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

  const statusOptions: OptionItem<UserStatusFilter>[] = [
    { label: '全部狀態', value: 'all' },
    ...(Object.keys(userStatusLabels) as UserStatus[]).map(status => ({ label: userStatusLabels[status], value: status })),
  ]

  const textFilters: { key: 'name' | 'username', label: string, icon: React.ReactNode }[] = [
    { key: 'name', label: '名稱', icon: <RiSearchLine /> },
    { key: 'username', label: 'Username', icon: <RiAtLine /> },
  ]

  const confirmContent = {
    ban: {
      icon: <RiForbidLine />,
      title: '確定要停權嗎？',
      description: `「${pendingAction?.user.name}」將無法登入主站，所有登入中的裝置會被登出。主站有 1 小時的登入快取，最晚 1 小時後生效。`,
      action: '停權',
    },
    remove: {
      icon: <RiDeleteBinLine />,
      title: '確定要刪除使用者嗎？',
      description: `「${pendingAction?.user.name}」的帳號與登入紀錄將被永久刪除，核銷過的邀請碼會保留紀錄。對方 GitHub 上的貼文 repo 不會被刪除。此操作無法復原。`,
      action: '刪除',
    },
  }
  const confirm = pendingAction ? confirmContent[pendingAction.type] : null

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

  return (
    <>
      <DataTableFilterForm aria-label="篩選使用者" onSubmit={handleSearch} onReset={handleResetFilters}>
        {textFilters.map(({ key, label, icon }) => (
          <DataTableTextFilter
            key={key}
            label={label}
            icon={icon}
            value={filters[key]}
            onValueChange={value => setFilters(previous => ({ ...previous, [key]: value }))}
          />
        ))}
        <DataTableSelectFilter
          label="狀態"
          options={statusOptions}
          value={filters.status}
          onValueChange={status => setFilters(previous => ({ ...previous, status }))}
        />
      </DataTableFilterForm>

      <div className="flex min-w-0 flex-col gap-3">
        <DataTable table={table} emptyText="沒有符合條件的使用者" />
        <DataTablePagination table={table} />
      </div>

      <AlertDialog {...confirmDialogProps}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">{confirm?.icon}</AlertDialogMedia>
            <AlertDialogTitle>{confirm?.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirm?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>取消</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isPending}
              onClick={() => pendingAction && runAction(pendingAction.type, pendingAction.user)}
            >
              {confirm?.action}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
