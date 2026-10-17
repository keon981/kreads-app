'use server'

import { refresh } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

// The console is public; only the profile page needs an account
export async function signOutAction(pathname: string): Promise<void> {
  const requestHeaders = await headers()
  await auth.api.signOut({ headers: requestHeaders })

  if (pathname.startsWith(paths.profile)) {
    redirect(paths.dashboard)
  }
  refresh()
}
