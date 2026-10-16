import Link from 'next/link'

import { ErrorLayout } from '@/components/layout/error-layout'
import { paths } from '@/configs/path-config'

export default function NotFound(): React.ReactNode {
  return (
    <ErrorLayout
      title="亂晃的人不一定是迷路，但這個頁面真的走丟了"
      description="連結失效或頁面不存在。請返回以繼續探索。"
      action="返回"
      actionProps={{
        nativeButton: false,
        render: <Link href={paths.home} />,
      }}
    />
  )
}
