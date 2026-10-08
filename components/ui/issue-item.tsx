'use client'

import Link from 'next/link'

import { useState } from 'react'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/configs/path-config'
import { cn } from '@/lib/utils'

import type { ButtonProps } from '@/components/ui/button'

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
      className={cn('flex-nowrap items-start rounded-none border-0 border-b last:border-b-0 p-3 md:p-6', className)}
      variant="outline"
    >
      {children}
    </Item>
  )
}

function IssueItemContent({ className, ...props }: React.ComponentProps<typeof ItemContent>) {
  return <ItemContent className={cn('min-w-0', className)} {...props} />
}

function AuthorLink({
  login,
  children,
  onMouseEnter,
  ...props
}: Omit<React.ComponentProps<typeof Link>, 'href'> & { login?: string }) {
  const [active, setActive] = useState(false)

  if (!login) return children

  return (
    <Link
      href={paths.user(login)}
      prefetch={active ? null : false}
      onMouseEnter={(e) => {
        setActive(true)
        onMouseEnter?.(e)
      }}
      {...props}
    >
      {children}
    </Link>
  )
}

function IssueItemMedia({
  src,
  login,
  fallback = login ?? 'ghost',
  ...props
}: React.ComponentProps<typeof ItemMedia> & { src?: string, login?: string, fallback?: string }) {
  return (
    <ItemMedia {...props}>
      <AuthorLink login={login}>
        <Avatar className="size-10">
          <AvatarImage src={src} />
          <AvatarFallback>
            {fallback.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </AuthorLink>
    </ItemMedia>
  )
}

function IssueUser({
  login,
  avatarUrl,
  className,
  ...props
}: React.ComponentProps<'h4'> & { login?: string, avatarUrl?: string }) {
  if (!login) {
    return <h4 className={cn('font-bold truncate', className)} {...props}>ghost</h4>
  }

  const userPath = paths.user(login)

  return (
    <h4 className={cn('font-bold truncate', className)} {...props}>
      <HoverCard>
        <HoverCardTrigger render={<AuthorLink login={login} />} className="hover:underline">
          {login}
        </HoverCardTrigger>
        <HoverCardContent align="start" className="w-72 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-bold truncate">{login}</p>
              <p className="text-muted-foreground truncate">
                @
                {login}
              </p>
            </div>
            <Avatar className="size-16 shrink-0">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>{login.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            nativeButton={false}
            render={<Link href={userPath} />}
          >
            查看個人檔案
          </Button>
        </HoverCardContent>
      </HoverCard>
    </h4>
  )
}

function IssueItemTitle({ children, className, ...props }: React.ComponentProps<typeof ItemTitle>) {
  return (
    <ItemTitle className={cn('w-full flex items-center justify-between ps-2.5 text-base/tight font-bold', className)} {...props}>
      {children}
    </ItemTitle>
  )
}

function IssueItemArticle({ html, className, ...props }: React.ComponentProps<'div'> & { html: string }) {
  return (
    <div
      data-slot="item-description"
      className={cn('mt-1 ps-2.5 pt-1 typeset typeset-post wrap-break-word', className)}
      // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  )
}

function IssueItemFooter({ ...props }: React.ComponentProps<typeof ButtonGroup>) {
  return <ButtonGroup className="px-0 gap-0.5!" {...props} />
}

function IssueItemButton({ ...props }: ButtonProps) {
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
    <Item className="flex-nowrap items-start rounded-none border-0 border-t p-3" variant="outline">
      <ItemMedia>
        <Avatar className="size-10 after:border-transparent">
          <Skeleton className="size-full rounded-full" />
        </Avatar>
      </ItemMedia>
      <ItemContent className="min-w-0">
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

function IssueItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn('flex w-full items-center justify-between gap-2', className)}
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
  IssueItemHeader,
  IssueItemMedia,
  IssueItemSkeleton,
  IssueItemTitle,
  IssueUser,
}
