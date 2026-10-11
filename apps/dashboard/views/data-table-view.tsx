'use client'

import { useState } from 'react'

import type { ColumnFiltersState, RowData } from '@tanstack/react-table'

import {
  DataTable,
  DataTableBulkBar,
  DataTableFilterForm,
  DataTablePagination,
  DataTableSelectFilter,
  DataTableTextFilter,
} from '@/components/blocks/data-table'

import type { DataTableInstance } from '@/components/blocks/data-table'
import type { OptionItem } from '@/types/option'

// `id` is the column the filter applies to
export type DataTableFilterField
  = | { type: 'text', id: string, label: string, icon: React.ReactNode }
    | { type: 'select', id: string, label: string, options: OptionItem<string>[] }

type FilterValues = Record<string, string>

function getEmptyFilters(fields: DataTableFilterField[]): FilterValues {
  return Object.fromEntries(fields.map(field => [field.id, field.type === 'select' ? 'all' : '']))
}

function getColumnFilters(filters: FilterValues): ColumnFiltersState {
  return Object.entries(filters)
    .map(([id, value]) => ({ id, value: value.trim() }))
    .filter(({ value }) => value !== '' && value !== 'all')
}

interface DataTableViewProps<TData extends RowData> {
  table: DataTableInstance<TData>
  filterFields: DataTableFilterField[]
  filterLabel: string
  emptyText: string
  itemLabel?: string
  bulkActions?: React.ReactNode
}

export function DataTableView<TData extends RowData>({
  table,
  filterFields,
  filterLabel,
  emptyText,
  itemLabel = '',
  bulkActions,
}: DataTableViewProps<TData>): React.ReactNode {
  const [filters, setFilters] = useState(() => getEmptyFilters(filterFields))

  function setFilter(id: string, value: string): void {
    setFilters(previous => ({ ...previous, [id]: value }))
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    table.setColumnFilters(getColumnFilters(filters))
    table.setPageIndex(0)
  }

  function handleResetFilters(): void {
    setFilters(getEmptyFilters(filterFields))
    table.resetColumnFilters()
    table.setPageIndex(0)
  }

  return (
    <>
      <DataTableFilterForm aria-label={filterLabel} onSubmit={handleSearch} onReset={handleResetFilters}>
        {filterFields.map(field => (field.type === 'text'
          ? (
              <DataTableTextFilter
                key={field.id}
                label={field.label}
                icon={field.icon}
                value={filters[field.id]}
                onValueChange={value => setFilter(field.id, value)}
              />
            )
          : (
              <DataTableSelectFilter
                key={field.id}
                label={field.label}
                options={field.options}
                value={filters[field.id]}
                onValueChange={value => setFilter(field.id, value)}
              />
            )))}
      </DataTableFilterForm>

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-3">
        <DataTable table={table} emptyText={emptyText} />
        <DataTablePagination table={table} />
        {bulkActions && (
          <DataTableBulkBar table={table} itemLabel={itemLabel}>{bulkActions}</DataTableBulkBar>
        )}
      </div>
    </>
  )
}
