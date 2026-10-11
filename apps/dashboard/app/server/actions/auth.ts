'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { paths } from '@/configs/path-config'
import { auth } from '@/lib/auth'

export async function signOutAction(): Promise<never> {
  await auth.api.signOut({ headers: await headers() })
  redirect(paths.signIn)
}
