import React from 'react'

import { RiGithubFill } from '@remixicon/react'

import { AboutCard } from '../blocks/about-card'
import { SignInButton, SignInCard } from '../blocks/sign-in'

function AppHeader() {
  return (
    <header
      className="sticky top-0 z-20 h-18 w-full flex shrink-0 items-center gap-2 bg-background/95 md:bg-background"
    >
      {/* bottom */}
      <div className="absolute bottom-0 left-2 w-[98%] md:border-b border-border"></div>

      {/* bottom left */}
      <div className="hidden md:block absolute top-15 -left-3 size-9 overflow-hidden">
        <div className="absolute top-2.75 left-3 size-12.5 md:border-t md:border-l border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>

      {/* bottom right */}
      <div className="hidden md:block absolute overflow-hidden size-9 top-15 -right-3">
        <div className="absolute top-2.75 right-3 size-12.5 md:border-t md:border-r border-border rounded-3xl shadow-[0_0_0_12px] shadow-background"></div>
      </div>
    </header>
  )
}

interface Props extends React.ComponentProps<typeof AboutCard> {
  isAuth?: boolean
}

export default function ArticleLayout({
  children,
  isAuth = false,
  ...props
}: Props) {
  return (
    <>
      <div className="hidden md:block md:size-px" />
      <section className="relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh md:pb-18 md:bg-card">
        <AppHeader />
        <article className="size-full flex flex-col">
          <div className="grow min-h-0 overflow-hidden rounded-3xl md:border md:border-t-0 border-border">
            <AboutCard {...props}>
              {/* bio */}
            </AboutCard>
            {/* main post */}
            {children}
          </div>
        </article>
      </section>
      {!isAuth && (
        <div className="fixed top-6 right-4 z-20 lg:relative lg:top-0 lg:right-0 lg:mt-18 w-fit">
          <SignInButton className="lg:hidden p-4 rounded-full">
            <RiGithubFill />
            登入 GitHub
          </SignInButton>
          <SignInCard className="hidden lg:flex w-80" />
        </div>
      )}
    </>
  )
}
