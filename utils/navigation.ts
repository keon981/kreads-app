import { paths } from '@/configs/path-config'

import type { Issue } from '@/types/issue'

export function safeNext(next: string | null | undefined, fallback = paths.home) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback

  return next
}

export function signInPath(next?: string) {
  if (!next) return paths.signIn

  return `${paths.signIn}?${new URLSearchParams({ next })}`
}

export function signUpPath(next?: string, error?: string) {
  if (!next) return paths.signUp

  const params = new URLSearchParams({ next })
  if (error) params.set('error', error)
  return `${paths.signUp}?${params}`
}

export const chatHref = (issue: Issue) => paths.post(issue.author?.login ?? '', issue.number)
