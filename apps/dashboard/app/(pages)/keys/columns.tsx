'use client'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

import { RiDeleteBinLine, RiEditLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { formatDateTime } from '@workspace/ui/lib/format'

import { DataTableColumnHeader, DataTableSelectCell, DataTableSelectHeader } from '@/components/blocks/data-table'
import { CopyButton } from '@/components/ui/copy-button'
import { UserAvatar } from '@/components/ui/user-avatar'

import type { DataTableFeatures } from '@/components/blocks/data-table'
import type { InviteRow, InviteStatus } from '@/types/invite'

export const inviteStatusLabels: Record<InviteStatus, string> = {
  unused: '未使用',
  redeemed: '已核銷',
}

interface InviteColumnsOptions {
  isAdmin: boolean
  onEdit: (invite: InviteRow) => void
  onDelete: (invite: InviteRow) => void
}

const columnHelper = createColumnHelper<DataTableFeatures, InviteRow>()

export function getInviteColumns({ isAdmin, onEdit, onDelete }: InviteColumnsOptions): ColumnDef<DataTableFeatures, InviteRow>[] {
  const columns = columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => <DataTableSelectHeader table={table} />,
      cell: ({ row }) => <DataTableSelectCell row={row} />,
      meta: { cardSlot: 'hidden', headerClassName: 'w-10', cellClassName: 'w-10' },
    }),
    columnHelper.accessor('code', {
      header: '邀請碼',
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <code className="font-mono">{row.original.code}</code>
          {isAdmin && (
            <CopyButton text={row.original.code} size="icon-xs" successMessage="已複製邀請碼" aria-label="複製邀請碼" />
          )}
        </div>
      ),
      filterFn: 'includesString',
      enableSorting: false,
      meta: { cardSlot: 'title' },
    }),
    columnHelper.accessor('status', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="狀態" />,
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
      sortFn: 'text',
      meta: { label: '狀態', cardSlot: 'badge' },
    }),
    columnHelper.accessor('role', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="分組" />,
      cell: ({ row }) => <Badge variant="secondary">{row.original.role}</Badge>,
      filterFn: 'equalsString',
      sortFn: 'text',
      meta: { label: '分組', cardSlot: 'subtitle' },
    }),
    columnHelper.accessor(row => row.redeemer?.name ?? '', {
      id: 'redeemer',
      header: ({ column }) => <DataTableColumnHeader column={column} title="核銷人" />,
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
      sortFn: 'text',
      meta: { label: '核銷人', cardSlot: 'primary' },
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="建立時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">{formatDateTime(row.original.createdAt)}</span>
      ),
      sortFn: 'basic',
      meta: { label: '建立時間' },
    }),
    columnHelper.accessor('redeemedAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="核銷時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.redeemedAt ? formatDateTime(row.original.redeemedAt) : '—'}
        </span>
      ),
      sortFn: 'basic',
      meta: { label: '核銷時間' },
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const invite = row.original
        const canEdit = invite.status === 'unused' || !!invite.redeemer

        return (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!canEdit}
              aria-label="編輯邀請碼"
              onClick={() => onEdit(invite)}
            >
              <RiEditLine />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-destructive hover:text-destructive"
              disabled={invite.status === 'redeemed'}
              aria-label="刪除邀請碼"
              onClick={() => onDelete(invite)}
            >
              <RiDeleteBinLine />
            </Button>
          </div>
        )
      },
      meta: { cardSlot: 'actions', headerClassName: 'w-24 text-right', cellClassName: 'w-24 text-right' },
    }),
  ])

  return isAdmin ? columns : columns.filter(column => column.id !== 'select' && column.id !== 'actions')
}
