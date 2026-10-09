import Link from 'next/link'

import { Button } from '@workspace/ui/components/button'

import { paths } from '@/configs/path-config'

export default function NotFound() {
  return (
    <div className="size-full flex justify-center items-center">
      <hgroup className="flex flex-col gap-4 justify-center items-center w-sm">
        <h2 className="font-bold text-foreground">
          亂晃的人不一定是迷路，但這個頁面真的走丟了
        </h2>
        <p className="text-sm text-muted-foreground">
          連結失效或頁面不存在。請返回以繼續探索。
        </p>
        <Button nativeButton={false} variant="secondary" size="lg" render={<Link href={paths.home} />}>
          返回
        </Button>
      </hgroup>
    </div>
  )
}
