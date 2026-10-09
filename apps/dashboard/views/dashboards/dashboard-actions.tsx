import { RiFilter3Line, RiRefreshLine } from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'

export function DashboardActions(): React.ReactNode {
  return (
    <>
      <Button variant="outline">
        <RiRefreshLine data-icon="inline-start" />
        重新整理
      </Button>
      <Button>
        <RiFilter3Line data-icon="inline-start" />
        篩選
      </Button>
    </>
  )
}
