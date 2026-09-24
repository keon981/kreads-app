import { notFound } from 'next/navigation'

import React from 'react'

import UserViewer from '@/features/user-viewer/user-viewer'
import { getSessionCache } from '@/lib/auth'
import { fetchViewerUser } from '@/server/users'

interface PageProps {
  params: Promise<{ id: string }> // 這裡定義為 Promise 類形
}

async function Page({ params }: PageProps) {
  const { id } = await params
  const username = decodeURIComponent(id)
  const [viewer, session] = await Promise.all([
    fetchViewerUser(username),
    getSessionCache(),
  ])

  if (!viewer) notFound()

  const isOwner = session?.user.username === viewer.username

  return <UserViewer user={viewer} isOwner={isOwner} />
}

export default Page
