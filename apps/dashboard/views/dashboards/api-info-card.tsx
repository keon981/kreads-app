'use client'

import { useEffect, useState } from 'react'

import { RiCheckLine, RiFileCopyLine, RiServerLine } from '@remixicon/react'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { cn } from '@workspace/ui/lib/utils'

import { apiEndpoints } from '@/__mocks__/dashboard'

import type { ApiEndpoint, LatencyLevel } from '@/types/dashboard'

const latencyClassNames: Readonly<Record<LatencyLevel, string>> = {
  fast: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  normal: 'bg-amber-500/10 text-amber-700 dark:text-amber-400',
  slow: 'bg-red-500/10 text-red-700 dark:text-red-400',
}

const copiedResetDelay = 1500

interface EndpointRowProps {
  endpoint: ApiEndpoint
}

function EndpointRow({ endpoint }: EndpointRowProps): React.ReactNode {
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    if (!isCopied)
      return
    const timer = window.setTimeout(setIsCopied, copiedResetDelay, false)
    return () => window.clearTimeout(timer)
  }, [isCopied])

  async function handleCopy(): Promise<void> {
    await navigator.clipboard.writeText(endpoint.url)
    setIsCopied(true)
  }

  return (
    <li className="flex items-center gap-3 rounded-lg border px-3 py-2">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{endpoint.name}</span>
          <Badge className={cn('tabular-nums', latencyClassNames[endpoint.latencyLevel])}>
            {endpoint.latencyMs}
            {' '}
            ms
          </Badge>
        </div>
        <code className="truncate font-mono text-xs text-muted-foreground">{endpoint.url}</code>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`複製 ${endpoint.name} 網址`}
        onClick={handleCopy}
      >
        {isCopied ? <RiCheckLine /> : <RiFileCopyLine />}
      </Button>
    </li>
  )
}

export function ApiInfoCard(): React.ReactNode {
  return (
    <Card className="min-w-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RiServerLine className="size-4 text-muted-foreground" />
          API 資訊
        </CardTitle>
        <CardDescription>選擇延遲最低的線路作為 Base URL</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-2">
          {apiEndpoints.map(endpoint => (
            <EndpointRow key={endpoint.id} endpoint={endpoint} />
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
