'use client'

import { useState } from 'react'

import { RiCheckLine, RiFileCopyLine, RiGithubFill } from '@remixicon/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'
import { useCopyLink } from '@/hooks/use-copy-link'

import { ButtonGroup } from '../ui/button-group'

interface Props {
  children?: React.ReactNode
  name: string
  id: string
  avatarUrl?: string
}

export function AboutUser({ name, id, children, avatarUrl }: Props) {
  const [isShareOpen, setIsShareOpen] = useState(false)

  const login = id.replace(/^@/, '')
  const githubPath = `https://github.com/${login}`
  const shareLink = (typeof window !== 'undefined' ? `${window.location.origin}/@${login}` : `/@${login}`)

  return (
    <>
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
              render={<a target="_blank" href={githubPath} rel="noopener noreferrer" />}
            >
              <RiGithubFill />
            </Button>
          </ButtonGroup>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => setIsShareOpen(true)}
          >
            Share
          </Button>
        </CardFooter>
      </Card>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        shareLink={shareLink}
      />
    </>
  )
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shareLink: string
  title?: string
  description?: string
}
function ShareDialog({
  open,
  onOpenChange,
  shareLink,
  title = '分享個人檔案',
  description = '複製連結以分享給其他人',
}: ShareDialogProps) {
  const { copied, copy } = useCopyLink()

  const handleCopy = () => {
    copy(shareLink)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <InputGroup>
          <InputGroupInput
            readOnly
            value={shareLink}
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
