import React from 'react'

import { SignUpForm } from './sign-up-card'

function Page() {
  return (
    <section className="size-full flex flex-col justify-center items-center gap-8">
      <h2 className="text-3xl font-bold">
        Kreads APP
      </h2>
      <SignUpForm />
    </section>
  )
}

export default Page
