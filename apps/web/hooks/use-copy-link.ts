'use client'

import { useBoolean, useCopyToClipboard, useTimeout } from 'usehooks-ts'

import { toast } from '@/components/ui/toast'

interface UseCopyLinkOptions {
  successMessage?: string
  errorMessage?: string
  timeout?: number
}

interface UseCopyLinkReturn {
  copied: boolean
  copy: (text: string) => Promise<boolean>
}

/**
 * Hook to copy text to the clipboard with a toast notification and temporary copied state.
 */
export function useCopyLink(options: UseCopyLinkOptions = {}): UseCopyLinkReturn {
  const {
    successMessage = '已複製連結至剪貼簿',
    errorMessage = '複製失敗，請手動複製',
    timeout = 2000,
  } = options

  const [, copyToClipboard] = useCopyToClipboard()
  const { value: copied, setTrue: setCopied, setFalse: resetCopied } = useBoolean(false)

  useTimeout(resetCopied, copied ? timeout : null)

  const copy = async (text: string): Promise<boolean> => {
    if (!text) return false

    const success = await copyToClipboard(text)
    toast.add(success
      ? { type: 'success', description: successMessage }
      : { type: 'error', description: errorMessage })
    if (success) setCopied()
    return success
  }

  return { copied, copy }
}

export type { UseCopyLinkOptions, UseCopyLinkReturn }
