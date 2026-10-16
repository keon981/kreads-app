import { LoadingLayout } from '@workspace/ui/components/loading-layout'

import { env } from '@/lib/env'

export default function Loading(): React.ReactNode {
  return <LoadingLayout>{env.NEXT_PUBLIC_APP_TITLE}</LoadingLayout>
}
