'use client'

import { useState } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import type { ColumnDef, Row } from '@tanstack/react-table'

import {
  RiDeleteBinLine,
  RiEditLine,
  RiEyeLine,
  RiEyeOffLine,
  RiFileCopyLine,
  RiMore2Line,
  RiPauseCircleLine,
  RiPlayCircleLine,
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
import { Progress } from '@workspace/ui/components/progress'
import { formatDateTime } from '@workspace/ui/lib/utils'

import { tokenGroups } from '@/__mocks__/keys'
import { CopyButton } from '@/components/ui/copy-button'
import { DataTableColumnHeader, DataTableSelectCell, DataTableSelectHeader } from '@/components/ui/data-table'

import { formatQuota, getMaskedKey, getQuotaPercent, tokenStatusLabels } from './utils'

import type { DataTableFeatures } from '@/components/ui/data-table'
import type { Token } from './types'

export interface TokenColumnActions {
  onEdit: (token: Token) => void
  onCopy: (token: Token) => void
  onToggleStatus: (token: Token) => void
  onDelete: (token: Token) => void
}

interface KeyCellProps {
  token: Token
}

function KeyCell({ token }: KeyCellProps): React.ReactNode {
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <code
        data-revealed={isRevealed}
        className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs data-[revealed=true]:w-60 data-[revealed=true]:break-all data-[revealed=true]:whitespace-normal"
      >
        {isRevealed ? token.key : getMaskedKey(token.key)}
      </code>
      <Button
        variant="ghost"
        size="icon-xs"
        aria-label={isRevealed ? '隱藏密鑰' : '顯示密鑰'}
        onClick={() => setIsRevealed(previous => !previous)}
      >
        {isRevealed ? <RiEyeOffLine /> : <RiEyeLine />}
      </Button>
      <CopyButton text={token.key} size="icon-xs" successMessage="已複製密鑰" aria-label="複製密鑰" />
    </div>
  )
}

function compareExpiresAt(rowA: Row<DataTableFeatures, Token>, rowB: Row<DataTableFeatures, Token>): number {
  // Never-expiring tokens sort after every dated token
  const valueA = rowA.original.expiresAt ?? '￿'
  const valueB = rowB.original.expiresAt ?? '￿'
  return valueA.localeCompare(valueB)
}

const columnHelper = createColumnHelper<DataTableFeatures, Token>()

export function getTokenColumns({ onEdit, onCopy, onToggleStatus, onDelete }: TokenColumnActions): ColumnDef<DataTableFeatures, Token>[] {
  return columnHelper.columns([
    columnHelper.display({
      id: 'select',
      header: ({ table }) => <DataTableSelectHeader table={table} />,
      cell: ({ row }) => <DataTableSelectCell row={row} />,
      enableSorting: false,
      meta: { headerClassName: 'w-10', cellClassName: 'w-10' },
    }),
    columnHelper.accessor('name', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="名稱" />,
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
      filterFn: 'includesString',
      sortFn: 'text',
    }),
    columnHelper.accessor('status', {
      header: '狀態',
      cell: ({ row }) => (
        <Badge
          variant="secondary"
          data-status={row.original.status}
          className="data-[status=disabled]:bg-muted data-[status=disabled]:text-muted-foreground data-[status=enabled]:bg-emerald-500/10 data-[status=enabled]:text-emerald-700 data-[status=exhausted]:bg-destructive/10 data-[status=exhausted]:text-destructive data-[status=expired]:bg-amber-500/10 data-[status=expired]:text-amber-700 dark:data-[status=enabled]:text-emerald-400 dark:data-[status=expired]:text-amber-400"
        >
          <span aria-hidden className="size-1.5 rounded-full bg-current" />
          {tokenStatusLabels[row.original.status]}
        </Badge>
      ),
      filterFn: 'equalsString',
      enableSorting: false,
    }),
    columnHelper.accessor('usedQuota', {
      id: 'quota',
      header: ({ column }) => <DataTableColumnHeader column={column} title="額度" />,
      cell: ({ row }) => {
        const token = row.original
        const percent = getQuotaPercent(token)
        let level = 'normal'
        if (percent >= 80)
          level = 'high'
        if (percent >= 100)
          level = 'full'

        return (
          <div className="flex min-w-44 flex-col gap-1.5">
            <span className="text-xs tabular-nums">
              <span className="font-medium">{formatQuota(token.usedQuota)}</span>
              <span className="text-muted-foreground">
                {' / '}
                {token.totalQuota === null ? '無限額度' : formatQuota(token.totalQuota)}
              </span>
            </span>
            {token.totalQuota === null
              ? <div aria-hidden className="h-1 w-full rounded-full bg-primary/20" />
              : (
                  <Progress
                    value={percent}
                    aria-label={`額度使用率 ${percent}%`}
                    data-level={level}
                    className="data-[level=full]:**:data-[slot=progress-indicator]:bg-destructive data-[level=high]:**:data-[slot=progress-indicator]:bg-amber-500"
                  />
                )}
          </div>
        )
      },
      sortFn: 'basic',
    }),
    columnHelper.accessor('group', {
      header: '分組',
      cell: ({ row }) => (
        <Badge variant="outline">
          {tokenGroups.find(group => group.value === row.original.group)?.label ?? row.original.group}
        </Badge>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor('key', {
      header: '密鑰',
      cell: ({ row }) => <KeyCell token={row.original} />,
      filterFn: 'includesString',
      enableSorting: false,
    }),
    columnHelper.accessor('createdAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="建立時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">{formatDateTime(row.original.createdAt)}</span>
      ),
      sortFn: 'text',
    }),
    columnHelper.accessor('expiresAt', {
      header: ({ column }) => <DataTableColumnHeader column={column} title="過期時間" />,
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {row.original.expiresAt ? formatDateTime(row.original.expiresAt) : '永不過期'}
        </span>
      ),
      sortFn: compareExpiresAt,
    }),
    columnHelper.display({
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const token = row.original
        const isEnabled = token.status === 'enabled'

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" aria-label={`${token.name} 的更多操作`} />}
            >
              <RiMore2Line />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-40">
              <DropdownMenuItem onClick={() => onEdit(token)}>
                <RiEditLine />
                編輯
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onCopy(token)}>
                <RiFileCopyLine />
                複製密鑰
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(token)}>
                {isEnabled ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
                {isEnabled ? '停用' : '啟用'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => onDelete(token)}>
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
}
