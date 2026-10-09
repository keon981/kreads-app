import React from 'react'

import { RiArrowRightSLine, RiGithubFill } from '@remixicon/react'

import { SignInButton } from '@/components/blocks/sign-in'

function Page() {
  return (
    <div className="size-full flex justify-center items-center">
      <hgroup className="flex flex-col gap-4 justify-center items-center w-sm">
        <h2 className="text-sm font-bold">繼續使用 GitHub 帳號登入</h2>
        <SignInButton
          variant="ghost"
          size="lg"
          className="w-full h-fit p-4 border-border"
        >
          <RiGithubFill className="size-6" />
          <p className="flex-1">使用 GitHub 帳號繼續</p>
          <RiArrowRightSLine />
        </SignInButton>
      </hgroup>
    </div>
  )
}

export default Page
