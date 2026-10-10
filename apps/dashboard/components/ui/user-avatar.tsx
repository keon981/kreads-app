import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'

import type { CurrentUser } from '@/types/user'

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  user: CurrentUser
}

export function UserAvatar({ user, ...props }: UserAvatarProps): React.ReactNode {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.avatarUrl} alt={user.displayName} />
      <AvatarFallback>{user.displayName.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
