import React from 'react'

interface PageProps {
  params: Promise<{ id: string }> // 這裡定義為 Promise 類形
}

async function Page({ params }: PageProps) {
  const { id } = await params
  return (
    <div>ID {id} Page</div>
  )
}

export default Page
