'use client'

import { useState } from 'react'

import { createColumnHelper } from '@tanstack/react-table'
import type { Row } from '@tanstack/react-table'

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
import { Tooltip, TooltipContent, TooltipTrigger } from '@workspace/ui/components/tooltip'
import { cn, formatDateTime } from '@workspace/ui/lib/utils'

import { tokenGroups } from '@/__mocks__/keys'
import {
  DataTableColumnHeader,
  DataTableSelectCell,
  DataTableSelectHeader,
} from '@/views/apps/keys/data-table'
import { useKeys } from '@/views/apps/keys/keys-context'
import { TOKEN_STATUS_META } from '@/views/apps/keys/token-config'
import { formatQuota, getMaskedKey, getQuotaPercent } from '@/views/apps/keys/token-utils'

import type { Token, TokenStatus } from '@/types/keys'
import type { DataTableFeatures } from '@/views/apps/keys/data-table'

interface TokenCellProps {
  token: Token
}

interface TokenStatusBadgeProps {
  status: TokenStatus
}

function TokenStatusBadge({ status }: TokenStatusBadgeProps): React.ReactNode {
  const meta = TOKEN_STATUS_META[status]

  return (
    <Badge variant="secondary" className={meta.className}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {meta.label}
    </Badge>
  )
}

function TokenQuotaCell({ token }: TokenCellProps): React.ReactNode {
  if (token.totalQuota === null) {
    return (
      <div className="flex min-w-44 flex-col gap-1.5">
        <span className="text-xs tabular-nums">
          <span className="font-medium">{formatQuota(token.usedQuota)}</span>
          <span className="text-muted-foreground"> / 無限額度</span>
        </span>
        <div aria-hidden className="h-1 w-full rounded-full bg-primary/20" />
      </div>
    )
  }

  const percent = getQuotaPercent(token)

  return (
    <div className="flex min-w-44 flex-col gap-1.5">
      <span className="text-xs tabular-nums">
        <span className="font-medium">{formatQuota(token.usedQuota)}</span>
        <span className="text-muted-foreground">
          {' / '}
          {formatQuota(token.totalQuota)}
        </span>
      </span>
      <Progress
        value={percent}
        aria-label={`額度使用率 ${percent}%`}
        className={cn(
          percent >= 100 && '[&_[data-slot=progress-indicator]]:bg-destructive',
          percent >= 80 && percent < 100 && '[&_[data-slot=progress-indicator]]:bg-amber-500',
        )}
      />
    </div>
  )
}

function TokenGroupBadge({ token }: TokenCellProps): React.ReactNode {
  const label = tokenGroups.find(group => group.value === token.group)?.label ?? token.group

  return <Badge variant="outline">{label}</Badge>
}

function TokenKeyCell({ token }: TokenCellProps): React.ReactNode {
  const { copyTokenKeys } = useKeys()
  const [isRevealed, setIsRevealed] = useState(false)

  return (
    <div className="flex items-center gap-1">
      <code
        className={cn(
          'rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs',
          isRevealed && 'w-60 break-all whitespace-normal',
        )}
      >
        {isRevealed ? token.key : getMaskedKey(token.key)}
      </code>
      <Tooltip>
        <TooltipTrigger
          render={(
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label={isRevealed ? '隱藏密鑰' : '顯示密鑰'}
              onClick={() => setIsRevealed(previous => !previous)}
            />
          )}
        >
          {isRevealed ? <RiEyeOffLine /> : <RiEyeLine />}
        </TooltipTrigger>
        <TooltipContent>{isRevealed ? '隱藏密鑰' : '顯示密鑰'}</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger
          render={(
            <Button
              variant="ghost"
              size="icon-xs"
              aria-label="複製密鑰"
              onClick={() => copyTokenKeys([token])}
            />
          )}
        >
          <RiFileCopyLine />
        </TooltipTrigger>
        <TooltipContent>複製密鑰</TooltipContent>
      </Tooltip>
    </div>
  )
}

function TokenActionsCell({ token }: TokenCellProps): React.ReactNode {
  const { openEditSheet, copyTokenKeys, toggleTokenStatus, requestDelete } = useKeys()
  const isEnabled = token.status === 'enabled'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`${token.name} 的更多操作`} />}
      >
        <RiMore2Line />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-auto min-w-40">
        <DropdownMenuItem onClick={() => openEditSheet(token)}>
          <RiEditLine />
          編輯
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => copyTokenKeys([token])}>
          <RiFileCopyLine />
          複製密鑰
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toggleTokenStatus(token)}>
          {isEnabled ? <RiPauseCircleLine /> : <RiPlayCircleLine />}
          {isEnabled ? '停用' : '啟用'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => requestDelete([token])}>
          <RiDeleteBinLine />
          刪除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function compareExpiresAt(
  rowA: Row<DataTableFeatures, Token>,
  rowB: Row<DataTableFeatures, Token>,
): number {
  // Never-expiring tokens sort after every dated token
  const valueA = rowA.original.expiresAt ?? '￿'
  const valueB = rowB.original.expiresAt ?? '￿'
  return valueA.localeCompare(valueB)
}

const columnHelper = createColumnHelper<DataTableFeatures, Token>()

export const tokenColumns = columnHelper.columns([
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
    cell: ({ row }) => <TokenStatusBadge status={row.original.status} />,
    filterFn: 'equalsString',
    enableSorting: false,
  }),
  columnHelper.accessor('usedQuota', {
    id: 'quota',
    header: ({ column }) => <DataTableColumnHeader column={column} title="額度" />,
    cell: ({ row }) => <TokenQuotaCell token={row.original} />,
    sortFn: 'basic',
  }),
  columnHelper.accessor('group', {
    header: '分組',
    cell: ({ row }) => <TokenGroupBadge token={row.original} />,
    enableSorting: false,
  }),
  columnHelper.accessor('key', {
    header: '密鑰',
    cell: ({ row }) => <TokenKeyCell token={row.original} />,
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
    cell: ({ row }) => <TokenActionsCell token={row.original} />,
    meta: { headerClassName: 'w-16 text-right', cellClassName: 'w-16 text-right' },
  }),
])
