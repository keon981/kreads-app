import { redirect } from 'next/navigation'

import { getSession } from '@/app/server/session'
import { paths } from '@/configs/path-config'

import { SignInForm } from './form'

export default async function SignInPage(): Promise<React.ReactNode> {
  if (await getSession()) redirect(paths.dashboard)

  return <SignInForm />
}
