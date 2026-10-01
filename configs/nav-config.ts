import { env } from '@/lib/env'

export const authConfig = {
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
} as const

export const homePageUrl = '/'

export const homeList = [homePageUrl, `/${env.NEXT_PUBLIC_HOME_USERNAME}`]
