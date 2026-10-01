import { authConfig } from '@/configs/nav-config'

import type { Issue } from '@/types/issue'

export function safeNext(next: string | null | undefined, fallback = '/') {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback

  return next
}

export function signInPath(next?: string) {
  if (!next) return authConfig.signInUrl

  return `${authConfig.signInUrl}?${new URLSearchParams({ next })}`
}

export function signUpPath(next?: string, error?: string) {
  if (!next) return authConfig.signUpUrl

  const params = new URLSearchParams({ next })
  if (error) params.set('error', error)
  return `${authConfig.signUpUrl}?${params}`
}

export const chatHref = (issue: Issue) => `@${issue.author?.login}/post/${issue.number}`
