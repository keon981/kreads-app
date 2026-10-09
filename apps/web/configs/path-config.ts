import { env } from '@/lib/env'

export const paths = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  profile: '/profile',
  user: (login: string) => `/@${login}`,
  post: (login: string, number: number) => `/@${login}/post/${number}`,
} as const

export const api = {
  signOut: '/api/sign-out',
} as const

export const homePaths: readonly string[] = [paths.home, `/${env.NEXT_PUBLIC_HOME_USERNAME}`]

export const privatePaths: readonly string[] = [paths.profile]
