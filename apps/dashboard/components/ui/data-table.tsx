'use client'

import {
  columnFilteringFeature,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_equalsString,
  filterFn_includesString,
  metaHelper,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_basic,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table'
import type { Column, ReactTable, Row, RowData, Table as TableInstance } from '@tanstack/react-table'

import {
  RiArrowDownLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiArrowUpDownLine,
  RiArrowUpLine,
  RiRefreshLine,
  RiSearchLine,
} from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { Checkbox } from '@workspace/ui/components/checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@workspace/ui/components/table'
import { cn } from '@workspace/ui/lib/utils'

import type { OptionItem } from '@/types/option'

interface DataTableColumnMeta {
  headerClassName?: string
  cellClassName?: string
}

export const dataTableFeatures = tableFeatures({
  columnFilteringFeature,
  rowSortingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  filterFns: { includesString: filterFn_includesString, equalsString: filterFn_equalsString },
  sortFns: { basic: sortFn_basic, text: sortFn_text },
  columnMeta: metaHelper<DataTableColumnMeta>(),
})

export type DataTableFeatures = typeof dataTableFeatures

export type DataTableInstance<TData extends RowData> = ReactTable<DataTableFeatures, TData>

interface DataTableProps<TData extends RowData> {
  table: DataTableInstance<TData>
  emptyText?: string
}

export function DataTable<TData extends RowData>({
  table,
  emptyText = '沒有資料',
}: DataTableProps<TData>): React.ReactNode {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllLeafColumns().length

  return (
    <div className="min-w-0 overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent">
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
    </div>
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

interface DataTablePaginationProps<TData extends RowData> {
  table: DataTableInstance<TData>
  pageSizeOptions?: OptionItem<number>[]
}

export function DataTablePagination<TData extends RowData>({
  table,
  pageSizeOptions = [
    { label: '10 筆／頁', value: 10 },
    { label: '20 筆／頁', value: 20 },
    { label: '50 筆／頁', value: 50 },
  ],
}: DataTablePaginationProps<TData>): React.ReactNode {
  const { pageIndex, pageSize } = table.state.pagination
  const pageCount = Math.max(table.getPageCount(), 1)
  const selectedCount = table.getSelectedRowIds().length
  const filteredCount = table.getFilteredRowModel().rows.length

  return (
    <div className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
      <p>
        {selectedCount > 0 && (
          <>
            已選擇
            {' '}
            <span className="font-medium text-foreground tabular-nums">{selectedCount}</span>
            {' '}
            項，
          </>
        )}
        共
        {' '}
        <span className="font-medium text-foreground tabular-nums">{filteredCount}</span>
        {' '}
        項
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        <Select
          items={pageSizeOptions}
          value={pageSize}
          onValueChange={(value) => {
            if (value !== null) {
              table.setPageSize(value)
            }
          }}
        >
          <SelectTrigger size="sm" aria-label="每頁筆數">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="tabular-nums">
          第
          {' '}
          <span className="font-medium text-foreground">{pageIndex + 1}</span>
          {' '}
          /
          {' '}
          {pageCount}
          {' '}
          頁
        </span>
        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="上一頁"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <RiArrowLeftSLine />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="下一頁"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            <RiArrowRightSLine />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface DataTableFilterFormProps extends Omit<React.ComponentProps<'form'>, 'onReset'> {
  onReset: () => void
}

export function DataTableFilterForm({
  className,
  children,
  onReset,
  ...props
}: DataTableFilterFormProps): React.ReactNode {
  return (
    <form
      role="search"
      className={cn('grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center', className)}
      {...props}
    >
      {children}
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 lg:flex-none">
          <RiSearchLine data-icon="inline-start" />
          查詢
        </Button>
        <Button type="button" variant="outline" className="flex-1 lg:flex-none" onClick={onReset}>
          <RiRefreshLine data-icon="inline-start" />
          重置
        </Button>
      </div>
    </form>
  )
}

interface DataTableTextFilterProps extends Omit<React.ComponentProps<typeof InputGroupInput>, 'onChange'> {
  label: string
  icon: React.ReactNode
  onValueChange: (value: string) => void
}

export function DataTableTextFilter({ label, icon, onValueChange, ...props }: DataTableTextFilterProps): React.ReactNode {
  return (
    <InputGroup className="lg:w-56">
      <InputGroupAddon>{icon}</InputGroupAddon>
      <InputGroupInput
        aria-label={label}
        placeholder={label}
        onChange={event => onValueChange(event.target.value)}
        {...props}
      />
    </InputGroup>
  )
}

interface DataTableSelectFilterProps<TValue extends string> {
  label: string
  options: OptionItem<TValue>[]
  value: TValue
  onValueChange: (value: TValue) => void
}

export function DataTableSelectFilter<TValue extends string>({
  label,
  options,
  value,
  onValueChange,
}: DataTableSelectFilterProps<TValue>): React.ReactNode {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => {
        if (next !== null)
          onValueChange(next)
      }}
    >
      <SelectTrigger aria-label={label} className="w-full lg:w-36">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
