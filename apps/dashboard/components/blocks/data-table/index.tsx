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
import type { ReactTable, RowData } from '@tanstack/react-table'

import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCloseLine,
  RiRefreshLine,
  RiSearchLine,
} from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { Separator } from '@workspace/ui/components/separator'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
import { cn } from '@workspace/ui/lib/utils'

import { DataTableCardList } from './card'
import { DataTableGrid } from './table'

import type { OptionItem } from '@/types/option'

export { DataTableColumnHeader, DataTableSelectCell, DataTableSelectHeader } from './table'

export type DataTableCardSlot = 'title' | 'subtitle' | 'badge' | 'primary' | 'field' | 'actions' | 'hidden'

interface DataTableColumnMeta {
  label?: string
  cardSlot?: DataTableCardSlot
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

export interface DataTableProps<TData extends RowData> {
  table: DataTableInstance<TData>
  emptyText?: string
}

export function DataTable<TData extends RowData>({
  table,
  emptyText = '沒有資料',
}: DataTableProps<TData>): React.ReactNode {
  const isMobile = useIsMobile()
  const { columnFilters, sorting } = table.state
  // A new query or sort remounts the card list, so it starts over from the first batch at the top
  const cardListKey = JSON.stringify([columnFilters, sorting])

  return (
    <div
      key={isMobile ? cardListKey : 'grid'}
      className={cn(
        'min-h-0 min-w-0 flex-1 overflow-auto',
        !isMobile && 'rounded-xl border bg-card *:data-[slot=table-container]:h-full',
      )}
    >
      {isMobile
        ? <DataTableCardList table={table} emptyText={emptyText} />
        : <DataTableGrid table={table} emptyText={emptyText} />}
    </div>
  )
}

interface DataTableBulkBarProps<TData extends RowData> {
  table: DataTableInstance<TData>
  itemLabel: string
  children: React.ReactNode
}

// Positioned against the nearest relative parent
export function DataTableBulkBar<TData extends RowData>({
  table,
  itemLabel,
  children,
}: DataTableBulkBarProps<TData>): React.ReactNode {
  const isMobile = useIsMobile()
  const selectedCount = table.getSelectedRowIds().length

  if (isMobile || selectedCount === 0) return null

  return (
    <div
      role="toolbar"
      aria-label="批次操作"
      className="absolute bottom-0 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 rounded-full border bg-popover p-1.5 text-sm shadow-lg"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="取消選取"
        onClick={() => table.resetRowSelection()}
      >
        <RiCloseLine />
      </Button>
      <Separator orientation="vertical" className="data-vertical:h-5 data-vertical:self-center" />
      <span className="flex items-center gap-2 px-1.5 whitespace-nowrap">
        <Badge className="tabular-nums">{selectedCount}</Badge>
        {`${itemLabel}已選擇`}
      </span>
      <Separator orientation="vertical" className="data-vertical:h-5 data-vertical:self-center" />
      {children}
    </div>
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
  const isMobile = useIsMobile()

  if (isMobile) return null

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
        <Button type="submit" size="lg" className="flex-1 lg:flex-none">
          <RiSearchLine data-icon="inline-start" />
          查詢
        </Button>
        <Button type="button" size="lg" variant="outline" className="flex-1 lg:flex-none" onClick={onReset}>
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
