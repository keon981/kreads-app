'use client'

import { useState } from 'react'

import { toast } from '@/components/ui/toast'

interface CopyLinkOptions {
  successMessage?: string
  errorMessage?: string
}

interface UseCopyLinkOptions extends CopyLinkOptions {
  timeout?: number
}

/**
 * Copies text to the clipboard and displays a toast notification.
 */
export async function copyLink(
  text: string,
  options: CopyLinkOptions = {},
): Promise<boolean> {
  const {
    successMessage = '已複製連結至剪貼簿',
    errorMessage = '複製失敗，請手動複製',
  } = options

  if (!text) return false

  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    toast.add({ type: 'success', description: successMessage })
    return true
  } catch {
    toast.add({ type: 'error', description: errorMessage })
    return false
  }
}

/**
 * Hook to handle copy-to-clipboard actions with temporary copied state.
 */
export function useCopyLink(options: UseCopyLinkOptions = {}) {
  const { timeout = 2000, ...copyOptions } = options
  const [copied, setCopied] = useState(false)

  const copy = async (text: string) => {
    const success = await copyLink(text, copyOptions)
    if (success) {
      setCopied(true)
      setTimeout(setCopied, timeout, false)
    }
    return success
  }

  return { copied, copy }
}

export type { CopyLinkOptions, UseCopyLinkOptions }
