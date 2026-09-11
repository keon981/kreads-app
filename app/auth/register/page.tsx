import React from 'react'

import { RestCard } from '@/components/blocks/rest-card'

function Page() {
  return (
    <section className="size-full flex flex-col justify-center items-center gap-4">
      <h2 className="text-2xl font-bold">
        Kreads App
      </h2>
      <RestCard />
    </section>
  )
}

export default Page
