import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'

import type { SessionUser } from '@/types/user'

interface UserAvatarProps extends React.ComponentProps<typeof Avatar> {
  user: Pick<SessionUser, 'name' | 'image'>
}

export function UserAvatar({ user, ...props }: UserAvatarProps): React.ReactNode {
  return (
    <Avatar {...props}>
      <AvatarImage src={user.image ?? undefined} alt={user.name} />
      <AvatarFallback>{user.name.slice(0, 1).toUpperCase()}</AvatarFallback>
    </Avatar>
  )
}
