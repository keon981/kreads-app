'use client'

import { RiDeleteBinLine } from '@remixicon/react'
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

import { useKeys } from '@/views/apps/keys/keys-context'

export function TokenDeleteDialog(): React.ReactNode {
  const { isDeleteDialogOpen, setDeleteDialogOpen, deleteTargets, confirmDelete } = useKeys()
  const [firstTarget] = deleteTargets
  const description = deleteTargets.length === 1 && firstTarget
    ? `令牌「${firstTarget.name}」將被永久刪除，使用此密鑰的應用程式會立即失效。此操作無法復原。`
    : `將永久刪除 ${deleteTargets.length} 個令牌，使用這些密鑰的應用程式會立即失效。此操作無法復原。`

  return (
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive">
            <RiDeleteBinLine />
          </AlertDialogMedia>
          <AlertDialogTitle>確定要刪除令牌嗎？</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={confirmDelete}>
            刪除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
