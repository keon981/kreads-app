import { REDIRECT_PARAM } from '@/configs/constants'

export const paths = {
  signIn: '/sign-in',
  dashboard: '/dashboard',
  users: '/users',
  keys: '/keys',
  profile: '/profile',
}

export function getSignInPath(redirectTo: string): string {
  const query = new URLSearchParams({ [REDIRECT_PARAM]: redirectTo })
  return `${paths.signIn}?${query}`
}
