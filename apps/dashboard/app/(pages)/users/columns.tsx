'use client'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import {
  RiDeleteBinLine,
  RiForbidLine,
  RiLogoutCircleRLine,
  RiMore2Line,
  RiShieldCheckLine,
} from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { formatDateTime } from '@workspace/ui/lib/format'

import { DataTableColumnHeader } from '@/components/ui/data-table'
import { UserAvatar } from '@/components/ui/user-avatar'

import { userStatusLabels } from './utils'

import type { DataTableFeatures } from '@/components/ui/data-table'
import type { UserActionType, UserRow } from './types'

interface UserColumnsOptions {
  isAdmin: boolean
  onAction: (type: UserActionType, user: UserRow) => void
}

const columnHelper = createColumnHelper<DataTableFeatures, UserRow>()

export function getUserColumns({ isAdmin, onAction }: UserColumnsOptions): ColumnDef<DataTableFeatures, UserRow>[] {
  const columns = columnHelper.columns([
    columnHelper.accessor('name', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="名稱" />,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <UserAvatar user={row.original} className="size-7" />
          <span className="font-medium">{row.original.name}</span>
        </div>
      ),
      filterFn: 'includesString',
      sortFn: 'text',
    }),
    columnHelper.accessor(row => row.username ?? '', {
      id: 'username',
      header: 'Username',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.username ?? '未完成註冊'}</span>,
      filterFn: 'includesString',
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.email ?? '', {
      id: 'email',
      header: 'Email',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
      enableSorting: false,
    }),
    columnHelper.accessor('status', {
      header: '狀態',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          data-status={row.original.status}
          className="data-[status=active]:bg-emerald-500/10 data-[status=active]:text-emerald-700 data-[status=banned]:bg-destructive/10 data-[status=banned]:text-destructive dark:data-[status=active]:text-emerald-400"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          {userStatusLabels[row.original.status]}
        </Badge>
      ),
      filterFn: 'equalsString',
      enableSorting: false,
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="建立時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">{formatDateTime(row.original.createdAt)}</span>
      ),
      sortFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const user = row.original
        const isBanned = user.status === 'banned'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`${user.name} 的更多操作`} />}
            >
              <RiMore2Line />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-40">
              <DropdownMenuItem onClick={() => onAction(isBanned ? 'unban' : 'ban', user)}>
                {isBanned ? <RiShieldCheckLine /> : <RiForbidLine />}
                {isBanned ? '解除停權' : '停權'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAction('revoke', user)}>
                <RiLogoutCircleRLine />
                撤銷登入
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onAction('remove', user)}>
                <RiDeleteBinLine />
                刪除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      meta: { headerClassName: 'w-16 text-right', cellClassName: 'w-16 text-right' },
    }),
  ])

  // viewer has no email data and no write access, so those columns are left out
  return isAdmin
    ? columns
    : columns.filter(column => column.id !== 'email' && column.id !== 'actions')
}
