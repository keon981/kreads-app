'use client'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { RiDeleteBinLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { formatDateTime } from '@workspace/ui/lib/format'

import { CopyButton } from '@/components/ui/copy-button'
import { DataTableColumnHeader } from '@/components/ui/data-table'
import { UserAvatar } from '@/components/ui/user-avatar'

import { inviteStatusLabels } from './utils'

import type { DataTableFeatures } from '@/components/ui/data-table'
import type { InviteRow } from './types'

interface InviteColumnsOptions {
  isAdmin: boolean
  onDelete: (invite: InviteRow) => void
}

const columnHelper = createColumnHelper<DataTableFeatures, InviteRow>()

export function getInviteColumns({ isAdmin, onDelete }: InviteColumnsOptions): ColumnDef<DataTableFeatures, InviteRow>[] {
  const columns = columnHelper.columns([
    columnHelper.accessor('code', {
      header: '邀請碼',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs">{row.original.code}</code>
          {isAdmin && (
            <CopyButton text={row.original.code} size="icon-xs" successMessage="已複製邀請碼" aria-label="複製邀請碼" />
          )}
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('status', {
      header: '狀態',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          data-status={row.original.status}
          className="data-[status=redeemed]:bg-muted data-[status=redeemed]:text-muted-foreground data-[status=unused]:bg-emerald-500/10 data-[status=unused]:text-emerald-700 dark:data-[status=unused]:text-emerald-400"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          {inviteStatusLabels[row.original.status]}
        </Badge>
      ),
      filterFn: 'equalsString',
      enableSorting: false,
    }),
    columnHelper.accessor(row => row.note ?? '', {
      id: 'note',
      header: '備註',
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.note || '—'}</span>,
      filterFn: 'includesString',
      enableSorting: false,
    }),
    columnHelper.display({
      id: 'redeemer',
      header: '核銷人',
      cell: ({ row }) => {
        const { redeemer, status } = row.original
        if (!redeemer) {
          return <span className="text-muted-foreground">{status === 'redeemed' ? '已刪除的使用者' : '—'}</span>
        }

        return (
          <div className="flex items-center gap-2">
            <UserAvatar user={redeemer} className="size-6" />
            <span className="font-medium">{redeemer.name}</span>
          </div>
        )
      },
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="建立時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">{formatDateTime(row.original.createdAt)}</span>
      ),
      sortFn: 'basic',
    }),
    columnHelper.accessor('redeemedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="核銷時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.redeemedAt ? formatDateTime(row.original.redeemedAt) : '—'}
        </span>
      ),
      sortFn: 'basic',
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-destructive hover:text-destructive"
          disabled={row.original.status === 'redeemed'}
          aria-label="刪除邀請碼"
          onClick={() => onDelete(row.original)}
        >
          <RiDeleteBinLine />
        </Button>
      ),
      meta: { headerClassName: 'w-16 text-right', cellClassName: 'w-16 text-right' },
    }),
  ])

  return isAdmin ? columns : columns.filter(column => column.id !== 'actions')
}
