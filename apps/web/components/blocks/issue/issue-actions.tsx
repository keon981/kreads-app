'use client'

import {
  RiChat1Line,
  RiHeartFill,
  RiHeartLine,
  RiShareForwardLine,
} from '@remixicon/react'
import { DialogTrigger } from '@workspace/ui/components/dialog'
import { toast } from '@workspace/ui/components/toast'
import { useDebouncedMutation } from '@workspace/ui/hooks/use-debounced-mutation'
import { useDialog } from '@workspace/ui/hooks/use-dialog'

import { toggleReactionAction } from '@/app/server/actions/posts'
import { IssueItemButton } from '@/components/ui/issue'
import { useAuth } from '@/contexts/auth-provider'
import { useAuthGuard } from '@/hooks/use-auth-guard'

import { IssueFormDialog } from './issue-form-dialog'

import type { IssueTarget } from '@/types/action'
import type { IssueFormDialogProps } from './issue-form-dialog'

type IssueItemButtonProps = React.ComponentProps<typeof IssueItemButton>

const isShow = (count?: number) => count ? 'block' : 'hidden'

function IssueReactionButton({ target, reaction, ...props }: {
  target: IssueTarget
  reaction?: {
    reactionCount: number
    isReacted: boolean
  }
} & IssueItemButtonProps) {
  const { user } = useAuth()
  const serverIsReacted = reaction?.isReacted ?? false
  const serverReactionCount = reaction?.reactionCount ?? 0
  const viewer = user?.id ?? ''

  const { data: isReacted, mutate: setIsReacted } = useDebouncedMutation({
    data: serverIsReacted,
    mutationFn: async (nextIsReacted) => {
      const res = await toggleReactionAction({
        ...target,
        isReacted: nextIsReacted,
        viewer,
      })

      if (res.isReacted === undefined) throw new Error(res.message)
    },
    onError: (error) => {
      toast.add({ type: 'error', description: error.message })
    },
  })

  const reactionCount = serverReactionCount + Number(isReacted) - Number(serverIsReacted)

  const handleClickHeart = () => {
    if (!reaction) return
    setIsReacted(prev => !prev)
  }

  const onAuthGuardClick = useAuthGuard(handleClickHeart)

  return (
    <IssueItemButton size="lg" {...props} onClick={onAuthGuardClick}>
      {isReacted
        ? <RiHeartFill className="text-destructive" />
        : <RiHeartLine />}
      <span className={isShow(reactionCount)}>{reactionCount}</span>
    </IssueItemButton>
  )
}

function IssueReplyButton({
  count,
  disabled,
  ...props
}: { count?: number, disabled?: boolean } & Pick<IssueFormDialogProps, 'onSubmit' | 'title' | 'placeholder' | 'defaultValues'>) {
  const { dialogProps, trigger } = useDialog()
  const onAuthGuardClick = useAuthGuard(trigger)

  return (
    <IssueFormDialog {...props} dialogProps={dialogProps}>
      <DialogTrigger
        disabled={disabled}
        render={<IssueItemButton size="lg" />}
        onClick={onAuthGuardClick}
      >
        <RiChat1Line />
        <span className={isShow(count)}>{count}</span>
      </DialogTrigger>
    </IssueFormDialog>
  )
}

function IssueShareButton(props: IssueItemButtonProps) {
  return (
    <IssueItemButton {...props}>
      <RiShareForwardLine />
    </IssueItemButton>
  )
}

export {
  IssueReactionButton,
  IssueReplyButton,
  IssueShareButton,
}
