import {
  RiContrast2Line,
  RiLogoutBoxLine,
  RiSettings3Line,
  RiUser3Line,
} from '@remixicon/react'
import { Button } from '@workspace/ui/components/button'
import {
  ResponsiveMenu,
  ResponsiveMenuContent,
  ResponsiveMenuGroup,
  ResponsiveMenuItem,
  ResponsiveMenuLabel,
  ResponsiveMenuRadioGroup,
  ResponsiveMenuRadioItem,
  ResponsiveMenuSeparator,
  ResponsiveMenuSub,
  ResponsiveMenuSubContent,
  ResponsiveMenuSubTrigger,
  ResponsiveMenuTrigger,
} from '@workspace/ui/components/responsive-menu'

import type { Meta, StoryObj } from '@storybook/react-vite'

const meta = {
  title: 'Components/ResponsiveMenu',
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ResponsiveMenu>
      <ResponsiveMenuTrigger render={<Button variant="outline" />}>
        選單
      </ResponsiveMenuTrigger>
      <ResponsiveMenuContent title="選單設定" className="w-56">
        <ResponsiveMenuGroup>
          <ResponsiveMenuLabel>帳號</ResponsiveMenuLabel>
          <ResponsiveMenuItem>
            <RiUser3Line />
            個人檔案
          </ResponsiveMenuItem>
          <ResponsiveMenuItem>
            <RiSettings3Line />
            偏好設定
          </ResponsiveMenuItem>
        </ResponsiveMenuGroup>
        <ResponsiveMenuSeparator />
        <ResponsiveMenuGroup>
          <ResponsiveMenuSub>
            <ResponsiveMenuSubTrigger>
              <RiContrast2Line />
              外觀
            </ResponsiveMenuSubTrigger>
            <ResponsiveMenuSubContent title="外觀">
              <ResponsiveMenuRadioGroup defaultValue="system">
                <ResponsiveMenuRadioItem value="light">淺色</ResponsiveMenuRadioItem>
                <ResponsiveMenuRadioItem value="dark">深色</ResponsiveMenuRadioItem>
                <ResponsiveMenuRadioItem value="system">跟隨系統</ResponsiveMenuRadioItem>
              </ResponsiveMenuRadioGroup>
            </ResponsiveMenuSubContent>
          </ResponsiveMenuSub>
        </ResponsiveMenuGroup>
        <ResponsiveMenuSeparator />
        <ResponsiveMenuGroup>
          <ResponsiveMenuItem variant="destructive">
            <RiLogoutBoxLine />
            登出
          </ResponsiveMenuItem>
        </ResponsiveMenuGroup>
      </ResponsiveMenuContent>
    </ResponsiveMenu>
  ),
}
