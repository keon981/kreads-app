'use client'

import * as React from 'react'

import { createPortal } from 'react-dom'

import { Button as ButtonPrimitive } from '@base-ui/react/button'
import { Radio as RadioPrimitive } from '@base-ui/react/radio'
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckLine,
  RiCloseLine,
} from '@remixicon/react'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from '@workspace/ui/components/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu'
import { RadioGroup } from '@workspace/ui/components/radio-group'
import { Tabs, TabsContent } from '@workspace/ui/components/tabs'
import { useIsMobile } from '@workspace/ui/hooks/use-mobile'
import { cn } from 'cn'

interface ResponsiveMenuContextValue {
  isMobile: boolean
  view: string
  setView: React.Dispatch<React.SetStateAction<string>>
  subPanelHost: HTMLDivElement | null
  setSubPanelHost: (node: HTMLDivElement | null) => void
}

const ResponsiveMenuContext = React.createContext<ResponsiveMenuContextValue | null>(null)

export function useResponsiveMenu(): ResponsiveMenuContextValue {
  const context = React.use(ResponsiveMenuContext)
  if (!context) {
    throw new Error('useResponsiveMenu must be used within a ResponsiveMenu.')
  }
  return context
}

const ResponsiveMenuGroupContext = React.createContext<boolean>(false)

interface ResponsiveMenuSubContextValue {
  subId: string
}

const ResponsiveMenuSubContext = React.createContext<ResponsiveMenuSubContextValue | null>(null)

export interface ResponsiveMenuProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

export function ResponsiveMenu({
  children,
  open,
  defaultOpen,
  onOpenChange,
}: ResponsiveMenuProps): React.JSX.Element {
  const isMobile = useIsMobile()
  const [view, setView] = React.useState('root')
  const [subPanelHost, setSubPanelHost] = React.useState<HTMLDivElement | null>(null)

  const handleOpenChangeComplete = React.useCallback((isOpen: boolean) => {
    if (!isOpen) {
      setView('root')
    }
  }, [])

  const contextValue = React.useMemo<ResponsiveMenuContextValue>(
    () => ({
      isMobile,
      view,
      setView,
      subPanelHost,
      setSubPanelHost,
    }),
    [isMobile, view, subPanelHost],
  )

  if (!isMobile) {
    return (
      <ResponsiveMenuContext value={contextValue}>
        <DropdownMenu open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
          {children}
        </DropdownMenu>
      </ResponsiveMenuContext>
    )
  }

  return (
    <ResponsiveMenuContext value={contextValue}>
      <Drawer
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        showSwipeHandle
        onOpenChangeComplete={handleOpenChangeComplete}
      >
        {children}
      </Drawer>
    </ResponsiveMenuContext>
  )
}

export interface ResponsiveMenuTriggerProps {
  'children'?: React.ReactNode
  'className'?: string
  'render'?: React.ReactElement
  'disabled'?: boolean
  'aria-label'?: string
  [key: string]: unknown
}

export function ResponsiveMenuTrigger(props: ResponsiveMenuTriggerProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()

  if (!isMobile) {
    return <DropdownMenuTrigger {...props} />
  }

  return <DrawerTrigger {...props} />
}

export interface ResponsiveMenuContentProps {
  title?: string
  children?: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  [key: string]: unknown
}

export function ResponsiveMenuContent({
  title,
  children,
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  ...props
}: ResponsiveMenuContentProps): React.JSX.Element {
  const { isMobile, view, setSubPanelHost } = useResponsiveMenu()

  if (!isMobile) {
    return (
      <DropdownMenuContent
        className={className}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        {...props}
      >
        {children}
      </DropdownMenuContent>
    )
  }

  return (
    <DrawerContent className="rounded-t-3xl bg-background text-foreground">
      <div
        className="flex max-h-[calc(100dvh-8rem)] flex-col overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
        onClick={e => e.stopPropagation()}
      >
        <Tabs value={view} orientation="vertical" className="w-full gap-0">
          <TabsContent value="root" keepMounted className="w-full outline-none">
            {title
              ? (
                  <div className="relative flex items-center justify-center py-3">
                    <DrawerClose
                      aria-label="關閉"
                      className="absolute left-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground"
                    >
                      <RiCloseLine className="size-5" />
                    </DrawerClose>
                    <DrawerTitle className="truncate px-8 text-center text-base font-semibold">
                      {title}
                    </DrawerTitle>
                  </div>
                )
              : (
                  <DrawerTitle className="sr-only">選單</DrawerTitle>
                )}
            <div className="flex flex-col gap-3 pt-2">
              {children}
            </div>
          </TabsContent>
          <div ref={setSubPanelHost} />
        </Tabs>
      </div>
    </DrawerContent>
  )
}

export interface ResponsiveMenuGroupProps {
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

export function ResponsiveMenuGroup({
  children,
  className,
  ...props
}: ResponsiveMenuGroupProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()

  if (!isMobile) {
    return <DropdownMenuGroup className={className} {...props}>{children}</DropdownMenuGroup>
  }

  return (
    <ResponsiveMenuGroupContext value={true}>
      <div
        role="group"
        className={cn(
          'divide-y divide-border/50 overflow-hidden rounded-2xl bg-muted',
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </ResponsiveMenuGroupContext>
  )
}

export interface ResponsiveMenuLabelProps {
  children?: React.ReactNode
  className?: string
  inset?: boolean
  [key: string]: unknown
}

export function ResponsiveMenuLabel({
  children,
  className,
  inset,
  ...props
}: ResponsiveMenuLabelProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()
  const isInGroup = React.use(ResponsiveMenuGroupContext)

  if (!isMobile) {
    return (
      <DropdownMenuLabel className={className} inset={inset} {...props}>
        {children}
      </DropdownMenuLabel>
    )
  }

  const content = (
    <div
      className={cn(
        'px-4 py-3 text-base font-semibold text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )

  if (!isInGroup) {
    return (
      <div className="overflow-hidden rounded-2xl bg-muted">
        {content}
      </div>
    )
  }

  return content
}

export interface ResponsiveMenuItemProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'destructive'
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
  closeOnClick?: boolean
  render?: React.ReactElement
  inset?: boolean
  [key: string]: unknown
}

export function ResponsiveMenuItem({
  children,
  className,
  variant = 'default',
  disabled,
  onClick,
  closeOnClick = true,
  render,
  inset,
  ...props
}: ResponsiveMenuItemProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()
  const isInGroup = React.use(ResponsiveMenuGroupContext)

  if (!isMobile) {
    return (
      <DropdownMenuItem
        className={className}
        variant={variant}
        disabled={disabled}
        onClick={onClick}
        render={render}
        inset={inset}
        {...props}
      >
        {children}
      </DropdownMenuItem>
    )
  }

  const itemClasses = cn(
    'flex w-full cursor-pointer items-center gap-1.5 px-4 py-3.5 text-left text-base font-semibold outline-hidden select-none active:bg-muted-foreground/10 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-5',
    variant === 'destructive'
      ? 'text-destructive active:bg-destructive/10 [&_svg]:text-destructive'
      : 'text-foreground',
    className,
  )

  let element: React.JSX.Element

  if (closeOnClick) {
    element = (
      <DrawerClose
        render={render}
        nativeButton={render ? false : undefined}
        disabled={disabled}
        onClick={onClick}
        className={itemClasses}
        {...props}
      >
        {children}
      </DrawerClose>
    )
  } else {
    element = (
      <ButtonPrimitive
        render={render}
        nativeButton={render ? false : undefined}
        disabled={disabled}
        onClick={onClick}
        className={itemClasses}
        {...props}
      >
        {children}
      </ButtonPrimitive>
    )
  }

  if (!isInGroup) {
    return (
      <div className="overflow-hidden rounded-2xl bg-muted">
        {element}
      </div>
    )
  }

  return element
}

export interface ResponsiveMenuSeparatorProps {
  className?: string
  [key: string]: unknown
}

export function ResponsiveMenuSeparator({
  className,
  ...props
}: ResponsiveMenuSeparatorProps): React.JSX.Element | null {
  const { isMobile } = useResponsiveMenu()

  if (!isMobile) {
    return <DropdownMenuSeparator className={className} {...props} />
  }

  return null
}

export interface ResponsiveMenuSubProps {
  children?: React.ReactNode
  [key: string]: unknown
}

export function ResponsiveMenuSub({
  children,
  ...props
}: ResponsiveMenuSubProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()
  const subId = React.useId()

  if (!isMobile) {
    return <DropdownMenuSub {...props}>{children}</DropdownMenuSub>
  }

  return (
    <ResponsiveMenuSubContext value={{ subId }}>
      {children}
    </ResponsiveMenuSubContext>
  )
}

export interface ResponsiveMenuSubTriggerProps {
  children?: React.ReactNode
  className?: string
  disabled?: boolean
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  inset?: boolean
  [key: string]: unknown
}

export function ResponsiveMenuSubTrigger({
  children,
  className,
  disabled,
  onClick,
  inset,
  ...props
}: ResponsiveMenuSubTriggerProps): React.JSX.Element {
  const { isMobile, setView } = useResponsiveMenu()
  const subContext = React.use(ResponsiveMenuSubContext)
  const isInGroup = React.use(ResponsiveMenuGroupContext)

  if (!isMobile) {
    return (
      <DropdownMenuSubTrigger className={className} inset={inset} {...props}>
        {children}
      </DropdownMenuSubTrigger>
    )
  }

  const subId = subContext?.subId ?? ''

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    onClick?.(e)
    if (!e.defaultPrevented) {
      setView(subId)
    }
  }

  const content = (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'flex w-full cursor-pointer items-center gap-1.5 px-4 py-3.5 text-left text-base font-semibold outline-hidden select-none active:bg-muted-foreground/10 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-5',
        className,
      )}
      {...props}
    >
      {children}
      <RiArrowRightSLine className="ml-auto size-5 text-muted-foreground" />
    </button>
  )

  if (!isInGroup) {
    return (
      <div className="overflow-hidden rounded-2xl bg-muted">
        {content}
      </div>
    )
  }

  return content
}

export interface ResponsiveMenuSubContentProps {
  title?: string
  children?: React.ReactNode
  className?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  sideOffset?: number
  alignOffset?: number
  [key: string]: unknown
}

export function ResponsiveMenuSubContent({
  title,
  children,
  className,
  side,
  align,
  sideOffset,
  alignOffset,
  ...props
}: ResponsiveMenuSubContentProps): React.JSX.Element | null {
  const { isMobile, setView, subPanelHost } = useResponsiveMenu()
  const subContext = React.use(ResponsiveMenuSubContext)

  if (!isMobile) {
    return (
      <DropdownMenuSubContent
        className={className}
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        {...props}
      >
        {children}
      </DropdownMenuSubContent>
    )
  }

  if (!subPanelHost) {
    return null
  }

  const subId = subContext?.subId ?? ''

  const subContent = (
    <TabsContent value={subId} className="w-full outline-none">
      <div className="relative flex items-center justify-center py-3">
        <button
          type="button"
          onClick={() => setView('root')}
          aria-label="返回"
          className="absolute left-0 cursor-pointer p-1 text-muted-foreground hover:text-foreground"
        >
          <RiArrowLeftSLine className="size-5" />
        </button>
        {title && (
          <h2 className="truncate px-8 text-center text-base font-semibold">
            {title}
          </h2>
        )}
      </div>
      <div className="flex flex-col gap-3 pt-2">
        {children}
      </div>
    </TabsContent>
  )

  return createPortal(subContent, subPanelHost)
}

export interface ResponsiveMenuRadioGroupProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
  className?: string
  [key: string]: unknown
}

export function ResponsiveMenuRadioGroup({
  value,
  defaultValue,
  onValueChange,
  children,
  className,
  ...props
}: ResponsiveMenuRadioGroupProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()

  if (!isMobile) {
    return (
      <DropdownMenuRadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className={className}
        {...props}
      >
        {children}
      </DropdownMenuRadioGroup>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl bg-muted', className)}>
      <RadioGroup
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        className="gap-0 divide-y divide-border/50"
        {...props}
      >
        {children}
      </RadioGroup>
    </div>
  )
}

export interface ResponsiveMenuRadioItemProps {
  value: string
  children?: React.ReactNode
  className?: string
  inset?: boolean
  disabled?: boolean
  [key: string]: unknown
}

export function ResponsiveMenuRadioItem({
  value,
  children,
  className,
  inset,
  disabled,
  ...props
}: ResponsiveMenuRadioItemProps): React.JSX.Element {
  const { isMobile } = useResponsiveMenu()

  if (!isMobile) {
    return (
      <DropdownMenuRadioItem
        value={value}
        className={className}
        inset={inset}
        disabled={disabled}
        {...props}
      >
        {children}
      </DropdownMenuRadioItem>
    )
  }

  return (
    <label
      className={cn(
        'relative flex w-full cursor-pointer items-center gap-1.5 px-4 py-3.5 text-base font-semibold outline-hidden select-none active:bg-muted-foreground/10 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-5',
        disabled && 'pointer-events-none opacity-50',
        className,
      )}
      {...props}
    >
      {children}
      <RadioPrimitive.Root
        value={value}
        disabled={disabled}
        className="ml-auto flex items-center justify-center outline-none"
      >
        <RadioPrimitive.Indicator className="flex items-center justify-center">
          <RiCheckLine className="size-5" />
        </RadioPrimitive.Indicator>
      </RadioPrimitive.Root>
    </label>
  )
}
