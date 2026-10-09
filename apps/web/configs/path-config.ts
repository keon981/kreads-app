import { env } from '@/lib/env'

interface Paths {
  readonly home: string
  readonly signIn: string
  readonly signUp: string
  readonly profile: string
  readonly user: (login: string) => string
  readonly post: (login: string, number: number) => string
}

export const paths: Paths = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  profile: '/profile',
  user: login => `/@${login}`,
  post: (login, number) => `/@${login}/post/${number}`,
}

export const homePaths: readonly string[] = [paths.home, `/${env.NEXT_PUBLIC_HOME_USERNAME}`]

export const privatePaths: readonly string[] = [paths.profile]
