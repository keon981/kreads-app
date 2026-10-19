'use client'

import { useEffect } from 'react'

import { RiRefreshLine } from '@remixicon/react'
import { ErrorLayout } from '@workspace/ui/components/error-layout'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
  unstable_retry?: () => void
}

export default function ErrorPage({
  error,
  reset,
  unstable_retry: retry,
}: ErrorPageProps): React.ReactNode {
  useEffect(() => {
    console.error(error)
  }, [error])

  function handleRetry(): void {
    if (retry) {
      retry()
      return
    }
    reset()
  }

  return (
    <ErrorLayout
      title="頁面載入時發生錯誤"
      description="資料讀取失敗，請稍後再試。"
      action={(
        <>
          <RiRefreshLine />
          重試
        </>
      )}
      actionProps={{
        onClick: handleRetry,
      }}
    />
  )
}
