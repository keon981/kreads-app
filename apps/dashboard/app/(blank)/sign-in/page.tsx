import { redirect } from 'next/navigation'

import { getSession } from '@/app/server/session'
import { REDIRECT_PARAM } from '@/configs/constants'

import { RedirectPathSchema } from './data'
import { SignInForm } from './form'

export default async function SignInPage({ searchParams }: PageProps<'/sign-in'>): Promise<React.ReactNode> {
  const query = await searchParams
  const redirectTo = RedirectPathSchema.parse(query[REDIRECT_PARAM])
  const session = await getSession()
  if (session) redirect(redirectTo)

  return <SignInForm redirectTo={redirectTo} />
}
