import { currentUser } from '@/__mocks__/user'

export function DashboardGreeting(): React.ReactNode {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-lg font-medium">
        早安，
        {currentUser.displayName}
        {' '}
        👋
      </p>
      <p className="text-sm text-muted-foreground">以下是你近 7 天的 API 使用概況。</p>
    </div>
  )
}
