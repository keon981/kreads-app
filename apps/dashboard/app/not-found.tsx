import Link from 'next/link'

import { ErrorLayout } from '@workspace/ui/components/error-layout'

import { paths } from '@/configs/path-config'

export default function NotFound(): React.ReactNode {
  return (
    <ErrorLayout
      title="找不到這個頁面"
      description="連結失效或頁面不存在，請回到儀表板。"
      action="回到儀表板"
      actionProps={{
        nativeButton: false,
        render: <Link href={paths.dashboard} />,
      }}
    />
  )
}
