import { useRef, useState } from 'react'

interface DialogHooksProps {
  onClick?: () => void
  onOpenChange?: (open: boolean) => void
}

export function useDialog(props?: DialogHooksProps) {
  const { onClick, onOpenChange }: DialogHooksProps = props || {}

  const [isOpen, setIsOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  const trigger = () => setIsOpen(true)

  const dismiss = () => {
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      onOpenChange?.(true)
      trigger()
    } else {
      onOpenChange?.(false)
      dismiss()
    }
  }

  return {
    triggerProps: {
      ref: triggerRef,
      onClick: () => {
        trigger()
        onClick?.()
      },
    },
    dialogProps: {
      open: isOpen,
      onOpenChange: handleOpenChange,
    },
    trigger,
    dismiss,
    setIsOpen,
  }
}

type UseDialogReturn = ReturnType<typeof useDialog>
export type { DialogHooksProps, UseDialogReturn }
