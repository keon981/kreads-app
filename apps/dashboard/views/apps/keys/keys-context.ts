'use client'

import { createContext, use } from 'react'

import type { Token, TokenFormValues } from '@/types/keys'
import type { DataTableInstance } from '@/views/apps/keys/data-table'

export interface KeysContextValue {
  readonly table: DataTableInstance<Token>
  readonly selectedTokens: readonly Token[]
  readonly isSheetOpen: boolean
  readonly editingToken: Token | null
  readonly isDeleteDialogOpen: boolean
  readonly deleteTargets: readonly Token[]
  readonly openCreateSheet: () => void
  readonly openEditSheet: (token: Token) => void
  readonly setSheetOpen: (isOpen: boolean) => void
  readonly saveToken: (values: TokenFormValues) => void
  readonly requestDelete: (targets: readonly Token[]) => void
  readonly setDeleteDialogOpen: (isOpen: boolean) => void
  readonly confirmDelete: () => void
  readonly toggleTokenStatus: (token: Token) => void
  readonly copyTokenKeys: (targets: readonly Token[]) => Promise<void>
}

export const KeysContext = createContext<KeysContextValue | null>(null)

export function useKeys(): KeysContextValue {
  const context = use(KeysContext)

  if (!context) {
    throw new Error('useKeys must be used within KeysProvider')
  }

  return context
}
