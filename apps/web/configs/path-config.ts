import { env } from '@/lib/env'

export const paths = {
  home: '/',
  signIn: '/sign-in',
  signUp: '/sign-up',
  profile: '/profile',
  user: (login: string) => `/@${login.replace(/^@/, '')}`,
  post: (login: string, number: number) => `/@${login.replace(/^@/, '')}/post/${number}`,
} as const

export const api = {
  signOut: '/api/sign-out',
  postList: '/api/posts',
  postDetail: (number: number) => `/api/posts/${number}`,
  commentList: (number: number) => `/api/posts/${number}/comments`,
} as const

export const homePaths: string[] = [paths.home, `/${env.NEXT_PUBLIC_HOME_USERNAME}`]

export const privatePaths: string[] = [paths.profile]
