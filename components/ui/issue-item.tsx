'use client'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/contexts/auth-provider'
import { cn } from '@/lib/utils'
import { useSignInDialog } from '@/store/sign-in-dialog'

function IssueItem({
  children,
  className,
  ...props
}: {
  avatarUrl?: string
  avatarFallback?: string
} & React.ComponentProps<typeof Item>) {
  return (
    <Item
      {...props}
      className={cn('rounded-none border-0 border-b last:border-b-0 p-3', className)}
      variant="outline"
    >
      {children}
    </Item>
  )
}

function IssueItemContent({ ...props }: React.ComponentProps<typeof ItemContent>) {
  return <ItemContent {...props} />
}

function IssueItemMedia({ src, fallback = 'ghost', ...props }: React.ComponentProps<typeof ItemTitle> & { src?: string, fallback?: string }) {
  return (
    <ItemMedia {...props}>
      <Avatar className="size-10">
        <AvatarImage src={src} />
        <AvatarFallback>
          {fallback?.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </ItemMedia>
  )
}

function IssueItemTitle({ children, ...props }: React.ComponentProps<typeof ItemTitle>) {
  return (
    <ItemTitle className="w-full flex ps-2.5 text-base/tight font-bold" {...props}>
      {children}
    </ItemTitle>
  )
}

function IssueItemArticle({ ...props }: React.ComponentProps<typeof ItemDescription>) {
  return (
    <ItemDescription
      className="mt-1 ps-2.5 line-clamp-none whitespace-pre-wrap wrap-break-word text-foreground text-base/tight"
      {...props}
    />
  )
}

function IssueItemFooter({ ...props }: React.ComponentProps<typeof ButtonGroup>) {
  return <ButtonGroup className="px-0 gap-0.5!" {...props} />
}

function IssueItemButton({ ...props }: React.ComponentProps<typeof Button>) {
  return (
    <ButtonGroup>
      <Button
        variant="ghost"
        size="icon-lg"
        {...props}
      />
    </ButtonGroup>
  )
}

function IssueItemSkeleton() {
  return (
    <Item className="rounded-none border-0 border-t p-3" variant="outline">
      <ItemMedia>
        <Avatar className="size-10 after:border-transparent">
          <Skeleton className="size-full rounded-full" />
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="ps-2.5 text-base/tight font-bold">
          <Skeleton className="w-25 h-4" />
        </ItemTitle>
        <ItemDescription className="mt-1 ps-2.5 text-foreground text-base/tight">
          <Skeleton render={<span />} className="w-90% h-4" />
        </ItemDescription>
        {/* footer button group */}
        <ButtonGroup className="px-0">
          {
            Array.from({ length: 3 }, (_, i) => (
              <div className="p-1.5" key={i}>
                <Skeleton className="size-6 rounded-full" />
              </div>

            ))
          }
        </ButtonGroup>
      </ItemContent>
    </Item>
  )
}

function IssueItemGroup({ className, ...props }: React.ComponentProps<typeof ItemGroup>) {
  return (
    <ItemGroup
      data-slot="item-group"
      className={cn('gap-0', className)}
      {...props}
    />
  )
}

export {
  IssueItem,
  IssueItemArticle,
  IssueItemButton,
  IssueItemContent,
  IssueItemFooter,
  IssueItemGroup,
  IssueItemMedia,
  IssueItemSkeleton,
  IssueItemTitle,
}
