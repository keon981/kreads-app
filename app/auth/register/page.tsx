import React from 'react'

import { RestCard } from '@/components/blocks/rest-card'

function Page() {
  return (
    <section className="size-full flex flex-col justify-center items-center gap-8">
      <h2 className="text-3xl font-bold">
        Kreads APP
      </h2>
      <RestCard />
    </section>
  )
}

export default Page
