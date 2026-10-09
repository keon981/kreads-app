'use client'

import { redirect, usePathname } from 'next/navigation'

import { signInPath, signUpPath } from '@/utils/navigation'

interface AuthRedirectProps {
  target: 'sign-in' | 'sign-up'
}

export function AuthRedirect({ target }: AuthRedirectProps): never {
  const pathname = usePathname()
  redirect(target === 'sign-in' ? signInPath({ next: pathname }) : signUpPath({ next: pathname }))
}
