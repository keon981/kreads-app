'use client'

import { useState } from 'react'

import { useTable } from '@tanstack/react-table'

import { toast } from '@workspace/ui/components/toast'

import { tokens as mockTokens } from '@/__mocks__/keys'
import { tokenColumns } from '@/views/apps/keys/columns'
import { dataTableFeatures } from '@/views/apps/keys/data-table'
import { KeysContext } from '@/views/apps/keys/keys-context'
import { getNewTokenDraft, getTokenFromFormValues } from '@/views/apps/keys/token-utils'

import type { Token, TokenFormValues } from '@/types/keys'
import type { KeysContextValue } from '@/views/apps/keys/keys-context'

const INITIAL_TABLE_STATE = {
  pagination: { pageIndex: 0, pageSize: 10 },
} as const

function getRowId(token: Token): string {
  return token.id
}

interface KeysProviderProps {
  children: React.ReactNode
}

export function KeysProvider({ children }: KeysProviderProps): React.ReactNode {
  const [tokens, setTokens] = useState<Token[]>(() => [...mockTokens])
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editingToken, setEditingToken] = useState<Token | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteTargets, setDeleteTargets] = useState<readonly Token[]>([])

  const table = useTable({
    features: dataTableFeatures,
    columns: tokenColumns,
    data: tokens,
    getRowId,
    autoResetPageIndex: false,
    initialState: INITIAL_TABLE_STATE,
  })

  const selectedTokens = table.getSelectedRowModel().rows.map(row => row.original)

  function openCreateSheet(): void {
    setEditingToken(null)
    setIsSheetOpen(true)
  }

  function openEditSheet(token: Token): void {
    setEditingToken(token)
    setIsSheetOpen(true)
  }

  function saveToken(values: TokenFormValues): void {
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

  function requestDelete(targets: readonly Token[]): void {
    if (targets.length === 0) {
      return
    }
    setDeleteTargets(targets)
    setIsDeleteDialogOpen(true)
  }

  function confirmDelete(): void {
    const targetIds = new Set(deleteTargets.map(token => token.id))

    setTokens(previous => previous.filter(token => !targetIds.has(token.id)))
    table.setRowSelection((previous) => {
      const next = { ...previous }
      targetIds.forEach((id) => {
        delete next[id]
      })
      return next
    })
    table.setPageIndex(0)
    setIsDeleteDialogOpen(false)
    toast.add({ title: `已刪除 ${targetIds.size} 個令牌`, type: 'success' })
  }

  function toggleTokenStatus(token: Token): void {
    const nextStatus = token.status === 'enabled' ? 'disabled' : 'enabled'

    setTokens(previous => previous.map(item => (item.id === token.id ? { ...item, status: nextStatus } : item)))
    toast.add({
      title: nextStatus === 'enabled' ? '令牌已啟用' : '令牌已停用',
      description: token.name,
      type: 'success',
    })
  }

  async function copyTokenKeys(targets: readonly Token[]): Promise<void> {
    if (targets.length === 0) {
      return
    }

    try {
      await navigator.clipboard.writeText(targets.map(token => token.key).join('\n'))
      toast.add({
        title: targets.length === 1 ? '已複製密鑰' : `已複製 ${targets.length} 個密鑰`,
        type: 'success',
      })
    } catch {
      toast.add({ title: '複製失敗，請檢查瀏覽器權限', type: 'error' })
    }
  }

  const value: KeysContextValue = {
    table,
    selectedTokens,
    isSheetOpen,
    editingToken,
    isDeleteDialogOpen,
    deleteTargets,
    openCreateSheet,
    openEditSheet,
    setSheetOpen: setIsSheetOpen,
    saveToken,
    requestDelete,
    setDeleteDialogOpen: setIsDeleteDialogOpen,
    confirmDelete,
    toggleTokenStatus,
    copyTokenKeys,
  }

  return <KeysContext value={value}>{children}</KeysContext>
}
