'use client'

import { Button } from '@workspace/ui/components/button'
import { ButtonGroup, ButtonGroupSeparator } from '@workspace/ui/components/button-group'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@workspace/ui/components/dialog'

export interface ConfirmMessage {
  title: string
  description?: string
  action: string
}

interface ConfirmDialogProps extends React.ComponentProps<typeof Dialog> {
  message: ConfirmMessage | null
  isPending?: boolean
  onConfirm: () => void
}

export function ConfirmDialog({ message, isPending = false, onConfirm, ...props }: ConfirmDialogProps): React.ReactNode {
  return (
    <Dialog {...props}>
      <DialogContent showCloseButton={false} className="min-h-30.5 w-70 gap-0">
        <DialogHeader className="items-center justify-center">
          <DialogTitle className="px-6 pt-2 pb-2 text-center">{message?.title}</DialogTitle>
          {message?.description && (
            <DialogDescription className="px-6 pb-5 text-center text-base">{message.description}</DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="gap-0 p-0">
          <ButtonGroup className="h-12 flex-1">
            <DialogClose render={<Button variant="ghost" disabled={isPending} className="h-full flex-1" />}>
              取消
            </DialogClose>
            <ButtonGroupSeparator />
            <Button
              variant="ghost"
              disabled={isPending}
              className="h-full flex-1 text-destructive hover:text-destructive"
              onClick={onConfirm}
            >
              {message?.action}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
