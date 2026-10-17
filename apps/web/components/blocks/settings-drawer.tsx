'use client'

import { useRouter } from 'next/navigation'

import React from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { RiArrowRightSLine, RiContrast2Line, RiEyeLine, RiLogoutBoxRLine } from '@remixicon/react'
import {
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
} from '@workspace/ui/components/drawer'
import { RadioGroup, RadioGroupItem } from '@workspace/ui/components/radio-group'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { useTheme } from 'next-themes'

import { VISIBILITY_DESCRIPTION } from '@/configs/constants'
import { themeOptions, visibilityOptions } from '@/configs/nav-config'
import { useAuth } from '@/contexts/auth-provider'
import { useVisibility } from '@/hooks/use-visibility'
import { signOutWithClient } from '@/lib/auth-client'

export function SettingsDrawerContent({
  view,
  onViewChange,
}: {
  view: string
  onViewChange: (view: string) => void
}): React.ReactNode {
  const router = useRouter()
  const { isAuth } = useAuth()
  const { theme, setTheme } = useTheme()
  const { isPublic, setIsPublic } = useVisibility()
  const queryClient = useQueryClient()

  const handleSignOut = async (): Promise<void> => {
    await signOutWithClient()
    queryClient.clear()
    router.refresh()
  }

  return (
    <>
      <DrawerPortal>
        <DrawerOverlay className="top-16" />
      </DrawerPortal>
      <DrawerContent className="data-[swipe-axis=x]:top-16 bg-background text-foreground data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-direction=left]:rounded-r-none data-[swipe-direction=left]:border-r-0">
        <Tabs
          value={view}
          onValueChange={value => onViewChange(String(value))}
          orientation="vertical"
          className="min-h-0 flex-col gap-0 py-2 overscroll-contain"
        >
          <TabsContent value="menu" className="text-base">
            <DrawerTitle className="sr-only">設定</DrawerTitle>
            <TabsList variant="line" className="w-full items-stretch gap-0 p-0">
              {isAuth && (
                <TabsTrigger value="visibility">
                  <RiEyeLine />
                  <span className="flex-1 text-left">公開</span>
                  <RiArrowRightSLine className="size-5 text-muted-foreground" />
                </TabsTrigger>
              )}
              <TabsTrigger value="theme">
                <RiContrast2Line />
                <span className="flex-1 text-left">外觀</span>
                <RiArrowRightSLine className="size-5 text-muted-foreground" />
              </TabsTrigger>
            </TabsList>
            {isAuth && (
              <DrawerClose
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-3 text-base text-destructive"
              >
                <RiLogoutBoxRLine className="size-6 shrink-0" />
                <span>登出</span>
              </DrawerClose>
            )}
          </TabsContent>
          <TabsContent value="visibility" className="text-base">
            <DrawerTitle className="sr-only">公開</DrawerTitle>
            <RadioGroup
              value={isPublic ? 'public' : 'private'}
              onValueChange={value => setIsPublic(value === 'public')}
              className="gap-0"
            >
              {visibilityOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                  <span>{label}</span>
                  <RadioGroupItem value={value} className="size-5" />
                </label>
              ))}
            </RadioGroup>
            <p className="px-4 pt-4 text-muted-foreground">
              {VISIBILITY_DESCRIPTION}
            </p>
          </TabsContent>
          <TabsContent value="theme" className="text-base">
            <DrawerTitle className="sr-only">外觀</DrawerTitle>
            <RadioGroup
              value={theme}
              onValueChange={value => setTheme(String(value))}
              className="gap-0"
            >
              {themeOptions.map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                >
                  <span>{label}</span>
                  <RadioGroupItem value={value} className="size-5" />
                </label>
              ))}
            </RadioGroup>
            <p className="px-4 pt-4 text-muted-foreground">
              選擇「跟隨系統」時，會使用裝置設定中的外觀。
            </p>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </>
  )
}
