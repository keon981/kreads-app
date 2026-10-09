'use client'

import { RiAddLine, RiDeleteBinLine, RiFileCopyLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'

import { useKeys } from '@/views/apps/keys/keys-context'

export function KeysActions(): React.ReactNode {
  const { selectedTokens, openCreateSheet, copyTokenKeys, requestDelete } = useKeys()
  const selectedCount = selectedTokens.length
  const hasSelection = selectedCount > 0
  const countLabel = hasSelection ? `（${selectedCount}）` : ''

  return (
    <>
      <Button variant="outline" disabled={!hasSelection} onClick={() => copyTokenKeys(selectedTokens)}>
        <RiFileCopyLine data-icon="inline-start" />
        複製所選
        {countLabel}
      </Button>
      <Button variant="destructive" disabled={!hasSelection} onClick={() => requestDelete(selectedTokens)}>
        <RiDeleteBinLine data-icon="inline-start" />
        刪除所選
        {countLabel}
      </Button>
      <Button onClick={openCreateSheet}>
        <RiAddLine data-icon="inline-start" />
        新增令牌
      </Button>
    </>
  )
}
