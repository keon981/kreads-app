'use client'

import { toast } from '@workspace/ui/components/toast'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'

type UseShareReturn = (data: ShareData) => boolean

/**
 * mobile: Web Share API 叫出系統分享選單。
 * 回傳 false 表示這次沒有叫出（桌機、瀏覽器不支援或資料無效），由呼叫端自行 fallback。
 */
export function useShare(): UseShareReturn {
  const isMobile = useIsMobile()

  return (data) => {
    if (!isMobile || !navigator.canShare?.(data)) return false

    navigator.share(data).catch((error: unknown) => {
      if (error instanceof DOMException && error.name === 'AbortError') return
      toast.add({ type: 'error', description: '分享失敗，請稍後再試' })
    })
    return true
  }
}

export type { UseShareReturn }
