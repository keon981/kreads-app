'use client'

import { useState } from 'react'

import type { Cell, Row, RowData } from '@tanstack/react-table'

import { useIntersectionObserver } from 'usehooks-ts'

import type { DataTableCardSlot, DataTableFeatures, DataTableInstance, DataTableProps } from './index'

const cardBatchSize = 20

function getCardSlot<TData extends RowData>(cell: Cell<DataTableFeatures, TData, unknown>): DataTableCardSlot {
  return cell.column.columnDef.meta?.cardSlot ?? 'field'
}

function getCardLabel<TData extends RowData>(cell: Cell<DataTableFeatures, TData, unknown>): string {
  const { meta, header } = cell.column.columnDef
  return meta?.label ?? (typeof header === 'string' ? header : cell.column.id)
}

export function DataTableCardList<TData extends RowData>({
  table,
  emptyText,
}: Required<DataTableProps<TData>>): React.ReactNode {
  const rows = table.getPrePaginatedRowModel().rows
  const [visibleCount, setVisibleCount] = useState(cardBatchSize)
  const { ref: sentinelRef } = useIntersectionObserver({
    onChange: (isIntersecting) => {
      if (isIntersecting) setVisibleCount(count => count + cardBatchSize)
    },
  })
  const hasMore = visibleCount < rows.length

  if (rows.length === 0) {
    return (
      <p className="flex h-32 items-center justify-center rounded-xl border bg-card text-sm text-muted-foreground">
        {emptyText}
      </p>
    )
  }

  return (
    <>
      <ul className="divide-y overflow-hidden rounded-xl border bg-card">
        {rows.slice(0, visibleCount).map(row => <DataTableCard key={row.id} table={table} row={row} />)}
      </ul>
      {/* A new sentinel per batch is observed afresh, so one still in view loads the next batch too */}
      {hasMore && <div key={visibleCount} ref={sentinelRef} aria-hidden className="h-px" />}
    </>
  )
}

interface DataTableCardProps<TData extends RowData> {
  table: DataTableInstance<TData>
  row: Row<DataTableFeatures, TData>
}

function DataTableCard<TData extends RowData>({ table, row }: DataTableCardProps<TData>): React.ReactNode {
  const cells = row.getAllCells()
  const [titleCells, subtitleCells, badgeCells, primaryCells, fieldCells, actionCells] = (['title', 'subtitle', 'badge', 'primary', 'field', 'actions'] as const)
    .map(slot => cells.filter(cell => getCardSlot(cell) === slot))

  const renderCells = (slotCells: Cell<DataTableFeatures, TData, unknown>[]): React.ReactNode =>
    slotCells.map(cell => <table.FlexRender key={cell.id} cell={cell} />)

  return (
    <li className="flex flex-col gap-3 p-4 text-sm">
      {/* Badges in the card header read as plain colored text */}
      <div className="flex items-start justify-between gap-3 **:data-[slot=badge]:h-auto **:data-[slot=badge]:bg-transparent! **:data-[slot=badge]:px-0 [&_[data-slot=badge]>[aria-hidden]]:hidden">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="font-semibold">{renderCells(titleCells)}</div>
          {subtitleCells.length > 0 && (
            <div className="text-xs text-muted-foreground">{renderCells(subtitleCells)}</div>
          )}
        </div>
        {badgeCells.length > 0 && (
          <div className="flex shrink-0 items-center gap-1.5 font-medium">{renderCells(badgeCells)}</div>
        )}
      </div>
      {(primaryCells.length > 0 || actionCells.length > 0) && (
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 *:text-foreground">{renderCells(primaryCells)}</div>
          <div className="flex shrink-0 items-center gap-1">{renderCells(actionCells)}</div>
        </div>
      )}
      {fieldCells.length > 0 && (
        <dl className="flex flex-col gap-2">
          {fieldCells.map(cell => (
            <div key={cell.id} className="flex items-center justify-between gap-4">
              <dt className="shrink-0 text-muted-foreground">{getCardLabel(cell)}</dt>
              <dd className="flex min-w-0 justify-end font-medium *:text-foreground">
                <table.FlexRender cell={cell} />
              </dd>
            </div>
          ))}
        </dl>
      )}
    </li>
  )
}
