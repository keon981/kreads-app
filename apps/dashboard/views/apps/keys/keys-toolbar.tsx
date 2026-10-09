'use client'

import { useState } from 'react'

import type { ColumnFiltersState } from '@tanstack/react-table'

import { RiKey2Line, RiRefreshLine, RiSearchLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'

import { useKeys } from '@/views/apps/keys/keys-context'
import { DEFAULT_TOKEN_FILTERS, TOKEN_STATUS_OPTIONS } from '@/views/apps/keys/token-config'

import type { TokenFilterValues } from '@/types/keys'

function getColumnFilters(filters: TokenFilterValues): ColumnFiltersState {
  const columnFilters: ColumnFiltersState = []

  if (filters.name.trim()) {
    columnFilters.push({ id: 'name', value: filters.name.trim() })
  }
  if (filters.key.trim()) {
    columnFilters.push({ id: 'key', value: filters.key.trim() })
  }
  if (filters.status !== 'all') {
    columnFilters.push({ id: 'status', value: filters.status })
  }

  return columnFilters
}

export function KeysToolbar(): React.ReactNode {
  const { table } = useKeys()
  const [filters, setFilters] = useState<TokenFilterValues>(DEFAULT_TOKEN_FILTERS)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    table.setColumnFilters(getColumnFilters(filters))
    table.setPageIndex(0)
  }

  function handleReset(): void {
    setFilters(DEFAULT_TOKEN_FILTERS)
    table.resetColumnFilters()
    table.setPageIndex(0)
  }

  return (
    <form
      role="search"
      aria-label="篩選令牌"
      className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center"
      onSubmit={handleSubmit}
    >
      <InputGroup className="lg:w-56">
        <InputGroupAddon>
          <RiSearchLine />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="令牌名稱"
          placeholder="令牌名稱"
          value={filters.name}
          onChange={event => setFilters(previous => ({ ...previous, name: event.target.value }))}
        />
      </InputGroup>
      <InputGroup className="lg:w-56">
        <InputGroupAddon>
          <RiKey2Line />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="令牌密鑰"
          placeholder="令牌密鑰"
          value={filters.key}
          onChange={event => setFilters(previous => ({ ...previous, key: event.target.value }))}
        />
      </InputGroup>
      <Select
        items={TOKEN_STATUS_OPTIONS}
        value={filters.status}
        onValueChange={(value) => {
          if (value !== null) {
            setFilters(previous => ({ ...previous, status: value }))
          }
        }}
      >
        <SelectTrigger aria-label="狀態" className="w-full lg:w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TOKEN_STATUS_OPTIONS.map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex gap-2">
        <Button type="submit" className="flex-1 lg:flex-none">
          <RiSearchLine data-icon="inline-start" />
          查詢
        </Button>
        <Button type="button" variant="outline" className="flex-1 lg:flex-none" onClick={handleReset}>
          <RiRefreshLine data-icon="inline-start" />
          重置
        </Button>
      </div>
    </form>
  )
}
