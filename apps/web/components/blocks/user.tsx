'use client'

import { RiCheckLine, RiFileCopyLine, RiGithubFill } from '@remixicon/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@workspace/ui/components/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@workspace/ui/components/input-group'
import { useCopy } from '@workspace/ui/hooks/use-copy'

import { paths } from '@/configs/path-config'
import { getAbsoluteUrl, invitePath } from '@/utils/navigation'

interface Props {
  children?: React.ReactNode
  name: string
  id: string
  avatarUrl?: string
  inviteCode?: string | null
}

export function AboutUser({ name, id, children, avatarUrl, inviteCode }: Props) {
  const login = id.replace(/^@/, '')
  const githubUrl = `https://github.com/${login}`
  const shareUrl = getAbsoluteUrl(paths.user(login))
  const inviteUrl = inviteCode ? getAbsoluteUrl(invitePath(inviteCode)) : ''

  return (
    <Card className="gap-0 bg-transparent border-0 rounded-none">
      <CardHeader className="[--card-spacing:--spacing(4)] gap-0">
        <CardTitle className="text-2xl/tight">
          {name}
        </CardTitle>
        <CardDescription>{id}</CardDescription>
        <CardAction>
          <Avatar className="size-21">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>
              {name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </CardAction>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex-col pt-3 gap-4 bg-transparent border-transparent rounded-none">
        <ButtonGroup className="w-full flex-1 justify-end">
          <Button
            variant="ghost"
            size="icon-lg"
            nativeButton={false}
            render={<a target="_blank" href={githubUrl} rel="noopener noreferrer" />}
          >
            <RiGithubFill />
          </Button>
        </ButtonGroup>
        <div className="w-full flex gap-2">
          <ShareDialog shareUrl={shareUrl}>
            <DialogTrigger render={<Button type="button" variant="outline" className="flex-1" />}>
              Share
            </DialogTrigger>
          </ShareDialog>
          {inviteUrl && (
            <ShareDialog
              shareUrl={inviteUrl}
              title="邀請朋友加入"
              description="複製邀請連結，朋友可直接前往註冊"
            >
              <DialogTrigger render={<Button type="button" variant="outline" className="flex-1" />}>
                邀請
              </DialogTrigger>
            </ShareDialog>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

interface ShareDialogProps {
  children: React.ReactNode
  shareUrl: string
  title?: string
  description?: string
}
function ShareDialog({
  children,
  shareUrl,
  title = '分享個人檔案',
  description = '複製連結以分享給其他人',
}: ShareDialogProps) {
  const [copied, copy] = useCopy({ successMessage: '已複製連結至剪貼簿' })

  const handleCopy = () => {
    copy(shareUrl)
  }

  return (
    <Dialog>
      {children}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupInput
            readOnly
            value={shareUrl}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              size="icon-xs"
              aria-label="複製連結"
              onClick={handleCopy}
            >
              {copied
                ? (
                    <RiCheckLine className="text-emerald-500" />
                  )
                : (
                    <RiFileCopyLine />
                  )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </DialogContent>
    </Dialog>
  )
}
