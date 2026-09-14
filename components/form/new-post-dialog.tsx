import { RiCloseLine } from '@remixicon/react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'

function NewPostFormDialog({
  children,
  avatarUrl,
  name,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, 'children'> & {
  children: React.ReactNode
  avatarUrl?: string
  name?: string | null
  className?: string
}) {
  return (
    <form className={className}>
      <Dialog {...props}>
        {children}
        {/* <div>

        <p>有什麼新鮮事？</p>
        <DialogTrigger render={<Button variant="outline">Share</Button>} />

      </div> */}
        <DialogContent
          showCloseButton={false}
          className="p-0 w-155 sm:max-w-[calc(100%-2rem)]"
        >
          <DialogHeader className="flex-row h-14 px-4 justify-between items-center border-b">
            <DialogClose>
              <RiCloseLine />
            </DialogClose>
            <DialogTitle className="flex-1 text-center">新貼文</DialogTitle>
            <div className="size-6" />
          </DialogHeader>
          <article className="flex flex-col px-6">
            <section className="w-full flex gap-x-3">
              {/* 頭像 */}
              <div className="flex flex-col">
                <Avatar>
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {name?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-3 flex-1 flex justify-center">
                  <div className="w-0.5 h-full bg-accent border" />
                </div>
              </div>
              {/* post */}
              <div className="flex-1">
                <h4 className="font-bold text-foreground text-base">{name}</h4>
                <Textarea
                  placeholder="有什麼新鮮事嗎？"
                  name=""
                  id=""
                  className="px-0 bg-transparent! border-0 focus-visible:ring-0 focus-visible:border-0 resize-none md:text-base"
                />
              </div>
            </section>
            <section className="mt-2.5 ps-2 flex items-center gap-x-5 opacity-40">
              <Avatar size="xs">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground/50 cursor-not-allowed text-base">
                新增到串文
              </p>
            </section>
          </article>
          <DialogFooter className="mx-0 mb-0 p-6 pt-1 border-0 bg-transparent">
            <Button variant="outline">發佈</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}

export { NewPostFormDialog }
