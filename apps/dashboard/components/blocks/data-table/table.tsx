'use client'

import type { Column, Row, RowData, Table as TableInstance } from '@tanstack/react-table'

import { RiArrowDownLine, RiArrowUpDownLine, RiArrowUpLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { cn } from '@workspace/ui/lib/utils'

import type { DataTableFeatures, DataTableProps } from './index'

export function DataTableGrid<TData extends RowData>({
  table,
  emptyText,
}: Required<DataTableProps<TData>>): React.ReactNode {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <Table>
      {/* Collapsed borders do not stick, so the divider under the header is a shadow */}
      <TableHeader className="sticky top-0 z-10 bg-card shadow-[inset_0_-1px_0_var(--color-border)] [&_tr]:border-b-0">
        {table.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
            {headerGroup.headers.map(header => (
              <TableHead
                key={header.id}
                className={cn('h-11 px-3 text-muted-foreground', header.column.columnDef.meta?.headerClassName)}
              >
                {header.isPlaceholder ? null : <table.FlexRender header={header} />}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {rows.length > 0
          ? rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                {row.getAllCells().map(cell => (
                  <TableCell
                    key={cell.id}
                    className={cn('px-3 py-2.5', cell.column.columnDef.meta?.cellClassName)}
                  >
                    <table.FlexRender cell={cell} />
                  </TableCell>
                ))}
              </TableRow>
            ))
          : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="h-32 text-center text-muted-foreground">
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
      </TableBody>
    </Table>
  )
}

interface DataTableColumnHeaderProps<TData extends RowData, TValue> {
  column: Column<DataTableFeatures, TData, TValue>
  title: string
  className?: string
}

export function DataTableColumnHeader<TData extends RowData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>): React.ReactNode {
  if (!column.getCanSort()) {
    return <span className={className}>{title}</span>
  }

  const sortDirection = column.getIsSorted()
  let SortIcon = RiArrowUpDownLine
  if (sortDirection === 'asc')
    SortIcon = RiArrowUpLine
  if (sortDirection === 'desc')
    SortIcon = RiArrowDownLine

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('-ml-2.5 text-muted-foreground hover:text-foreground data-[sorted=true]:text-foreground', className)}
      data-sorted={sortDirection !== false}
      onClick={column.getToggleSortingHandler()}
    >
      {title}
      <SortIcon data-icon="inline-end" className={cn(sortDirection === false && 'opacity-50')} />
    </Button>
  )
}

interface DataTableSelectHeaderProps<TData extends RowData> {
  table: TableInstance<DataTableFeatures, TData>
}

export function DataTableSelectHeader<TData extends RowData>({
  table,
}: DataTableSelectHeaderProps<TData>): React.ReactNode {
  return (
    <Checkbox
      aria-label="選擇本頁全部"
      className="data-indeterminate:border-primary data-indeterminate:bg-primary data-indeterminate:text-primary-foreground"
      checked={table.getIsAllPageRowsSelected()}
      indeterminate={!table.getIsAllPageRowsSelected() && table.getIsSomePageRowsSelected()}
      onCheckedChange={checked => table.toggleAllPageRowsSelected(checked)}
    />
  )
}

interface DataTableSelectCellProps<TData extends RowData> {
  row: Row<DataTableFeatures, TData>
}

export function DataTableSelectCell<TData extends RowData>({
  row,
}: DataTableSelectCellProps<TData>): React.ReactNode {
  return (
    <Checkbox
      aria-label="選擇此列"
      checked={row.getIsSelected()}
      disabled={!row.getCanSelect()}
      onCheckedChange={checked => row.toggleSelected(checked)}
    />
  )
}
