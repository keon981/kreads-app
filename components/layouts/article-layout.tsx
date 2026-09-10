import React from 'react'

import { RiGithubFill } from '@remixicon/react'

import { CommentHeader } from '../blocks/comment'
import { SignInButton, SignInCard } from '../blocks/sign-in'
import AppHeader from './app-header'

interface Props extends React.ComponentProps<typeof CommentHeader> {
  isAuth: boolean
}

export default function ArticleLayout({
  children,
  isAuth = false,
  ...props
}: Props) {
  return (
    <>
      <div className="hidden md:block md:size-px"></div>
      <section className="relative w-full md:w-160 md:max-w-160 flex flex-col items-center min-h-dvh md:pb-18 md:bg-card">
        <AppHeader />
        <article className="size-full flex flex-col">
          <div className="grow min-h-0 overflow-hidden rounded-3xl md:border md:border-t-0 border-border">
            <CommentHeader {...props}>
              {/* bio */}
            </CommentHeader>
            {/* main post */}
            {children}
          </div>
        </article>
        {!!isAuth && (
          <div className="fixed top-6 right-4 z-20 lg:relative lg:top-0 lg:right-0 lg:mt-18 w-fit">
            <SignInButton className="lg:hidden p-4 rounded-full">
              <RiGithubFill />
              登入 GitHub
            </SignInButton>
            <SignInCard className="hidden lg:flex w-80" />
          </div>
        )}

      </section>
    </>
  )
}
