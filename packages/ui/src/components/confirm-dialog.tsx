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
import { cn } from 'cn'

import type { ButtonProps } from '@workspace/ui/components/button'

interface DialogRootProps extends Omit<React.ComponentProps<typeof Dialog>, 'children'> {
  children?: React.ReactNode
}

function ConfirmDialogHeader({ title, description }: {
  title?: React.ReactNode
  description?: React.ReactNode
}): React.ReactNode {
  return (
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
  )
}

interface ConfirmDialogProps extends DialogRootProps {
  title: React.ReactNode
  description?: React.ReactNode
  confirmText: React.ReactNode
  cancelText?: React.ReactNode
  onConfirm?: ButtonProps['onClick']
  confirmProps?: ButtonProps
  cancelProps?: ButtonProps
}

function ConfirmDialog({
  children,
  title,
  description,
  confirmText,
  cancelText = '取消',
  onConfirm,
  confirmProps,
  cancelProps,
  ...props
}: ConfirmDialogProps): React.ReactNode {
  return (
    <Dialog {...props}>
      {children}
      <DialogContent showCloseButton={false} className="w-70 min-h-30.5 gap-0">
        <ConfirmDialogHeader title={title} description={description} />
        <DialogFooter className="p-0 gap-0">
          <ButtonGroup className="flex-1 h-12">
            <DialogClose
              render={(
                <Button
                  variant="ghost"
                  {...cancelProps}
                  className={cn('flex-1 h-full', cancelProps?.className)}
                >
                  {cancelText}
                </Button>
              )}
            />
            <ButtonGroupSeparator />
            <Button
              variant="ghost"
              {...confirmProps}
              onClick={onConfirm}
              className={cn('flex-1 h-full text-destructive hover:text-destructive', confirmProps?.className)}
            >
              {confirmText}
            </Button>
          </ButtonGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface NoticeConfirmDialogProps extends DialogRootProps {
  title?: React.ReactNode
  description?: React.ReactNode
  actionText?: React.ReactNode
  actionProps?: ButtonProps
  onAction?: ButtonProps['onClick']
  className?: string
}

function NoticeConfirmDialog({
  children,
  title,
  description,
  actionText = '我知道了',
  actionProps,
  onAction,
  className,
  ...props
}: NoticeConfirmDialogProps): React.ReactNode {
  return (
    <Dialog {...props}>
      {children}
      <DialogContent showCloseButton={false} className={cn('w-70 min-h-30.5 gap-0', className)}>
        <ConfirmDialogHeader title={title} description={description} />
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

export { ConfirmDialog, NoticeConfirmDialog }
export type { ConfirmDialogProps, NoticeConfirmDialogProps }
