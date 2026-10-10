'use client'

import { useState } from 'react'

import { useTable } from '@tanstack/react-table'
import type { ColumnFiltersState } from '@tanstack/react-table'

import {
  RiAddLine,
  RiDeleteBinLine,
  RiFileCopyLine,
  RiKey2Line,
  RiRefreshLine,
  RiSearchLine,
} from '@remixicon/react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog'
import { Button } from '@workspace/ui/components/button'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@workspace/ui/components/input-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@workspace/ui/components/select'
import { toast } from '@workspace/ui/components/toast'
import { useCopy } from '@workspace/ui/hooks/use-copy'

import { tokens as mockTokens } from '@/__mocks__/keys'
import { SectionPageLayout } from '@/components/layout/section-page-layout'
import { DataTable, dataTableFeatures, DataTablePagination } from '@/components/ui/data-table'

import { getTokenColumns } from './columns'
import { TokenFormSheet } from './token-form-sheet'
import { getNewTokenDraft, getTokenFromFormValues, tokenStatusLabels } from './utils'

import type { OptionItem } from '@/types/option'
import type { Token, TokenFilterValues, TokenFormValues, TokenStatus, TokenStatusFilter } from './types'

const emptyFilters: TokenFilterValues = { name: '', key: '', status: 'all' }

function getColumnFilters(filters: TokenFilterValues): ColumnFiltersState {
  const columnFilters: ColumnFiltersState = []

  if (filters.name.trim())
    columnFilters.push({ id: 'name', value: filters.name.trim() })
  if (filters.key.trim())
    columnFilters.push({ id: 'key', value: filters.key.trim() })
  if (filters.status !== 'all')
    columnFilters.push({ id: 'status', value: filters.status })

  return columnFilters
}

export function TokensTable(): React.ReactNode {
  const [tokens, setTokens] = useState<Token[]>(mockTokens)
  const [filters, setFilters] = useState<TokenFilterValues>(emptyFilters)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingToken, setEditingToken] = useState<Token | null>(null)
  const [deleteTargets, setDeleteTargets] = useState<Token[]>([])
  const [, copy] = useCopy({ successMessage: '已複製密鑰' })

  const columns = getTokenColumns({
    onEdit: (token) => {
      setEditingToken(token)
      setIsSheetOpen(true)
    },
    onCopy: token => copy(token.key),
    onToggleStatus: (token) => {
      const nextStatus = token.status === 'enabled' ? 'disabled' : 'enabled'
      setTokens(previous => previous.map(item => (item.id === token.id ? { ...item, status: nextStatus } : item)))
      toast.add({ title: nextStatus === 'enabled' ? '令牌已啟用' : '令牌已停用', description: token.name, type: 'success' })
    },
    onDelete: token => setDeleteTargets([token]),
  })

  const table = useTable({
    features: dataTableFeatures,
    columns,
    data: tokens,
    getRowId: token => token.id,
    autoResetPageIndex: false,
    initialState: { pagination: { pageIndex: 0, pageSize: 10 } },
  })

  const selectedTokens = table.getSelectedRowModel().rows.map(row => row.original)
  const selectionLabel = selectedTokens.length > 0 ? `（${selectedTokens.length}）` : ''

  const statusOptions: OptionItem<TokenStatusFilter>[] = [
    { label: '全部狀態', value: 'all' },
    ...(Object.keys(tokenStatusLabels) as TokenStatus[]).map(status => ({ label: tokenStatusLabels[status], value: status })),
  ]

  const textFilters: { key: 'name' | 'key', label: string, icon: React.ReactNode }[] = [
    { key: 'name', label: '令牌名稱', icon: <RiSearchLine /> },
    { key: 'key', label: '令牌密鑰', icon: <RiKey2Line /> },
  ]

  function handleSearch(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    table.setColumnFilters(getColumnFilters(filters))
    table.setPageIndex(0)
  }

  function handleResetFilters(): void {
    setFilters(emptyFilters)
    table.resetColumnFilters()
    table.setPageIndex(0)
  }

  function handleCreate(): void {
    setEditingToken(null)
    setIsSheetOpen(true)
  }

  function handleSave(values: TokenFormValues): void {
    if (editingToken) {
      const nextToken = getTokenFromFormValues(values, editingToken)
      setTokens(previous => previous.map(token => (token.id === nextToken.id ? nextToken : token)))
      toast.add({ title: '令牌已更新', description: nextToken.name, type: 'success' })
    } else {
      const nextToken = getTokenFromFormValues(values, getNewTokenDraft())
      setTokens(previous => [nextToken, ...previous])
      table.resetSorting()
      table.setPageIndex(0)
      toast.add({ title: '令牌已建立', description: nextToken.name, type: 'success' })
    }
    setIsSheetOpen(false)
  }

  function handleConfirmDelete(): void {
    const targetIds = new Set(deleteTargets.map(token => token.id))

    setTokens(previous => previous.filter(token => !targetIds.has(token.id)))
    table.setRowSelection((previous) => {
      const next = { ...previous }
      targetIds.forEach(id => delete next[id])
      return next
    })
    table.setPageIndex(0)
    setDeleteTargets([])
    toast.add({ title: `已刪除 ${targetIds.size} 個令牌`, type: 'success' })
  }

  return (
    <SectionPageLayout
      title="令牌管理"
      description="建立與管理 API 令牌，控制每個令牌的額度、分組與有效期限。"
      actions={(
        <>
          <Button
            variant="outline"
            disabled={selectedTokens.length === 0}
            onClick={() => copy(selectedTokens.map(token => token.key).join('\n'))}
          >
            <RiFileCopyLine data-icon="inline-start" />
            複製所選
            {selectionLabel}
          </Button>
          <Button variant="destructive" disabled={selectedTokens.length === 0} onClick={() => setDeleteTargets(selectedTokens)}>
            <RiDeleteBinLine data-icon="inline-start" />
            刪除所選
            {selectionLabel}
          </Button>
          <Button onClick={handleCreate}>
            <RiAddLine data-icon="inline-start" />
            新增令牌
          </Button>
        </>
      )}
    >
      <form
        role="search"
        aria-label="篩選令牌"
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center"
        onSubmit={handleSearch}
      >
        {textFilters.map(({ key, label, icon }) => (
          <InputGroup key={key} className="lg:w-56">
            <InputGroupAddon>{icon}</InputGroupAddon>
            <InputGroupInput
              aria-label={label}
              placeholder={label}
              value={filters[key]}
              onChange={event => setFilters(previous => ({ ...previous, [key]: event.target.value }))}
            />
          </InputGroup>
        ))}
        <Select
          items={statusOptions}
          value={filters.status}
          onValueChange={(value) => {
            if (value !== null)
              setFilters(previous => ({ ...previous, status: value }))
          }}
        >
          <SelectTrigger aria-label="狀態" className="w-full lg:w-36">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map(option => (
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
          <Button type="button" variant="outline" className="flex-1 lg:flex-none" onClick={handleResetFilters}>
            <RiRefreshLine data-icon="inline-start" />
            重置
          </Button>
        </div>
      </form>

      <div className="flex min-w-0 flex-col gap-3">
        <DataTable table={table} emptyText="沒有符合條件的令牌" />
        <DataTablePagination
          table={table}
          pageSizeOptions={[
            { label: '10 筆／頁', value: 10 },
            { label: '20 筆／頁', value: 20 },
            { label: '50 筆／頁', value: 50 },
          ]}
        />
      </div>

      <TokenFormSheet open={isSheetOpen} onOpenChange={setIsSheetOpen} token={editingToken} onSubmit={handleSave} />

      <AlertDialog open={deleteTargets.length > 0} onOpenChange={open => !open && setDeleteTargets([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <RiDeleteBinLine />
            </AlertDialogMedia>
            <AlertDialogTitle>確定要刪除令牌嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTargets.length === 1
                ? `令牌「${deleteTargets[0]?.name}」將被永久刪除，使用此密鑰的應用程式會立即失效。此操作無法復原。`
                : `將永久刪除 ${deleteTargets.length} 個令牌，使用這些密鑰的應用程式會立即失效。此操作無法復原。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleConfirmDelete}>
              刪除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SectionPageLayout>
  )
}
