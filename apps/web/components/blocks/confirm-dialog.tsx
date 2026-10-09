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
import { cn } from '@workspace/ui/lib/utils'

import type { ButtonProps } from '@workspace/ui/components/button'

interface AlertDialog {
  onCancel?: ButtonProps['onClick']
  onConfirm?: ButtonProps['onClick']
  confirmProps?: ButtonProps
  cancelProps?: ButtonProps
}

function DeleteAlertDialog({
  children,
  onConfirm,
  confirmProps,
  cancelProps,
  ...props
}: WithNodeChildren<typeof Dialog> & AlertDialog) {
  return (
    <Dialog {...props}>
      {children}
      <DialogContent showCloseButton={false} className="w-70 min-h-30.5 gap-0">
        <DialogHeader className="justify-center items-center">
          <DialogTitle className="px-6 pt-2 pb-2">刪除貼文？</DialogTitle>
          <DialogDescription className="px-6 pb-5 text-base text-center">刪除這則貼文後，即無法恢復顯示。</DialogDescription>
        </DialogHeader>
        <DialogFooter className="p-0 gap-0">
          <ButtonGroup className="flex-1 h-12">
            <DialogClose
              render={(
                <Button
                  variant="ghost"
                  {...cancelProps}
                  className={cn('flex-1 h-full', cancelProps?.className)}
                >取消
                </Button>
              )}
            />
            <ButtonGroupSeparator />
            <Button
              variant="ghost"
              {...confirmProps}
              onClick={onConfirm}
              className={cn('flex-1 h-full text-destructive hover:text-destructive', confirmProps?.className)}
            >刪除
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CancelAlertDialog({
  children,
  onConfirm,
  confirmProps,
  cancelProps,
  ...props
}: WithNodeChildren<typeof Dialog> & AlertDialog) {
  return (
    <Dialog {...props}>
      {children}
      <DialogContent showCloseButton={false} className="w-70 min-h-30.5">
        <DialogHeader className="justify-center items-center">
          <DialogTitle>捨棄貼文？</DialogTitle>
        </DialogHeader>
        <DialogFooter className="p-0 gap-0">
          <ButtonGroup className="flex-1">
            <DialogClose
              render={(
                <Button
                  variant="ghost"
                  {...cancelProps}
                  className={cn('flex-1 h-full', cancelProps?.className)}
                >取消
                </Button>
              )}
            />
            <ButtonGroupSeparator />
            <Button
              variant="ghost"
              {...confirmProps}
              onClick={onConfirm}
              className={cn('flex-1 h-full text-destructive hover:text-destructive', confirmProps?.className)}
            >捨棄
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface NoticeAlertDialogProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actionText?: React.ReactNode
  actionProps?: ButtonProps
  onAction?: ButtonProps['onClick']
}

function NoticeAlertDialog({
  children,
  title,
  description,
  actionText = '我知道了',
  actionProps,
  onAction,
  ...props
}: WithNodeChildren<typeof Dialog> & NoticeAlertDialogProps) {
  return (
    <Dialog {...props}>
      {children}
      <DialogContent showCloseButton={false} className="w-70 min-h-30.5 gap-0">
        <DialogHeader className="justify-center items-center">
          <DialogTitle className={cn('px-6 pt-2 pb-2', !description && 'pb-4', !title && 'sr-only')}>
            {title ?? '提示'}
          </DialogTitle>
          {description && (
            <DialogDescription className="px-6 pb-5 text-base text-center">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="p-0 gap-0">
          <ButtonGroup className="flex-1 h-12">
            <DialogClose
              render={(
                <Button
                  variant="ghost"
                  {...actionProps}
                  onClick={onAction ?? actionProps?.onClick}
                  className={cn('flex-1 h-full', actionProps?.className)}
                >
                  {actionText}
                </Button>
              )}
            />
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const InfoAlertDialog = NoticeAlertDialog

export type { NoticeAlertDialogProps }
export { CancelAlertDialog, DeleteAlertDialog, InfoAlertDialog, NoticeAlertDialog }
