'use client'

import * as React from 'react'

import { RiArchiveLine, RiCommandLine, RiDeleteBinLine, RiFileLine, RiGithubFill, RiInboxLine, RiSendPlaneLine } from '@remixicon/react'

import { NavUser } from '@/components/layouts/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { CommentHeader } from '../blocks/comment'
import { SignInButton, SignInCard } from '../blocks/sign-in'
import AppHeader from './app-header'

// This is sample data
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Inbox',
      url: '#',
      icon: (
        <RiInboxLine />
      ),
      isActive: true,
    },
    {
      title: 'Drafts',
      url: '#',
      icon: (
        <RiFileLine />
      ),
      isActive: false,
    },
    {
      title: 'Sent',
      url: '#',
      icon: (
        <RiSendPlaneLine />
      ),
      isActive: false,
    },
    {
      title: 'Junk',
      url: '#',
      icon: (
        <RiArchiveLine />
      ),
      isActive: false,
    },
    {
      title: 'Trash',
      url: '#',
      icon: (
        <RiDeleteBinLine />
      ),
      isActive: false,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="md:h-8 md:p-0"
                render={<a href="#" />}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <RiCommandLine className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </Sidebar>
  )
}

interface AppSidebarInsetProps extends React.ComponentProps<typeof CommentHeader> {

}

export function AppSidebarInset({
  children,
  ...commentHeaderProps
}: AppSidebarInsetProps) {
  return (
    <SidebarInset className="flex-row items-start justify-center gap-4">
      <div className="hidden md:block md:size-px"></div>
      <section className="relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh md:pb-18 md:bg-card">
        <AppHeader />

        {/* acticle */}
        <article className="size-full flex flex-col">
          <div className="grow min-h-0 overflow-hidden rounded-3xl md:border md:border-t-0 border-border">
            <CommentHeader {...commentHeaderProps}>
              {/* bio */}
            </CommentHeader>
            {/* main post */}
            {children}
          </div>
        </article>

        {/* footer */}
        <footer className="mb-17 w-full h-12 flex justify-center items-center text-muted-foreground">
          <p>© 2026</p>
        </footer>
      </section>
      <div className="fixed top-6 right-4 z-20 lg:relative lg:top-0 lg:right-0 lg:mt-18 w-fit">
        <SignInButton className="lg:hidden p-4 rounded-full">
          <RiGithubFill />
          登入 GitHub
        </SignInButton>
        <SignInCard className="hidden lg:flex w-80" />
      </div>
    </SidebarInset>
  )
}
