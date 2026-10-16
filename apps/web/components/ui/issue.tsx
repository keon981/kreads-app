'use client'

import Link from 'next/link'

import { useState } from 'react'

import {
  RiBold,
  RiFileCopyLine,
  RiItalic,
  RiScissorsCutLine,
  RiStrikethrough,
  RiUnderline,
} from '@remixicon/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@workspace/ui/components/avatar'
import { Button } from '@workspace/ui/components/button'
import { ButtonGroup } from '@workspace/ui/components/button-group'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@workspace/ui/components/context-menu'
import { Empty, EmptyDescription, EmptyHeader } from '@workspace/ui/components/empty'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@workspace/ui/components/hover-card'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from '@workspace/ui/components/item'
import {
  MarkdownEditor,
  MarkdownEditorClipboardItem,
  MarkdownEditorContent,
  MarkdownEditorMarkItem,
} from '@workspace/ui/components/markdown-editor'
import { Skeleton } from '@workspace/ui/components/skeleton'
import { cn } from '@workspace/ui/lib/utils'

import { paths } from '@/configs/path-config'

import type { ButtonProps } from '@workspace/ui/components/button'
import type { UseMarkdownEditorReturn } from '@workspace/ui/components/markdown-editor'

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

function IssueItemArticle({ html, className, children, ...props }: React.ComponentProps<'div'> & { html?: string }) {
  const articleProps = {
    'data-slot': 'item-article',
    'className': cn('mt-1 ps-2.5 pt-1 typeset typeset-post wrap-break-word', className),
    ...props,
  }

  if (html === undefined) return <div {...articleProps}>{children}</div>

  // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
  return <div {...articleProps} dangerouslySetInnerHTML={{ __html: html }} />
}

function IssueItemFooter({ className, ...props }: React.ComponentProps<typeof ButtonGroup>) {
  return <ButtonGroup className={cn('-ms-2 px-0 gap-0!', className)} {...props} />
}

function IssueItemButton({ className, ...props }: ButtonProps) {
  return (
    <ButtonGroup className="rounded-full overflow-hidden">
      <Button
        variant="ghost"
        size="lg"
        className={cn('gap-1 rounded-full! [&_svg:not([class*="size-"])]:size-5 hover:bg-muted', className)}
        {...props}
      />
    </ButtonGroup>
  )
}

function IssueItemSkeleton() {
  return (
    <Item data-slot="issue-item-skeleton" className="flex-nowrap items-start rounded-none border-0 border-b last:border-b-0 p-3" variant="outline">
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

function IssueEmpty({ children, className, ...props }: React.ComponentProps<typeof Empty>) {
  return (
    <Empty data-slot="issue-empty" className={cn('py-10', className)} {...props}>
      <EmptyHeader>
        <EmptyDescription>{children}</EmptyDescription>
      </EmptyHeader>
    </Empty>
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

interface IssueContentEditorProps {
  editor: UseMarkdownEditorReturn['editor']
  value?: string
  name?: string
  className?: string
}

function IssueContentEditor({
  editor,
  value,
  name = 'content',
  className,
}: IssueContentEditorProps) {
  return (
    <>
      <MarkdownEditor editor={editor}>
        <ContextMenu>
          <ContextMenuTrigger>
            <MarkdownEditorContent className={cn('md:text-base', className)} />
          </ContextMenuTrigger>
          <ContextMenuContent className="w-36">
            <MarkdownEditorMarkItem mark="bold">
              <RiBold />
              粗體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="italic">
              <RiItalic />
              斜體
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="underline">
              <RiUnderline />
              底線
            </MarkdownEditorMarkItem>
            <MarkdownEditorMarkItem mark="strike">
              <RiStrikethrough />
              刪除線
            </MarkdownEditorMarkItem>
            <ContextMenuSeparator />
            <MarkdownEditorClipboardItem command="copy">
              <RiFileCopyLine />
              複製
            </MarkdownEditorClipboardItem>
            <MarkdownEditorClipboardItem command="cut">
              <RiScissorsCutLine />
              剪下
            </MarkdownEditorClipboardItem>
          </ContextMenuContent>
        </ContextMenu>
      </MarkdownEditor>
      {value !== undefined && <input type="hidden" name={name} value={value} />}
    </>
  )
}

export {
  IssueContentEditor,
  IssueEmpty,
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
export type { IssueContentEditorProps }
