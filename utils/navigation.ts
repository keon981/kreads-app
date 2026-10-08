import { paths } from '@/configs/path-config'

import type { Issue } from '@/types/issue'

export function safeNext(next: string | null | undefined, fallback = paths.home) {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback

  return next
}

interface AuthPathOptions {
  readonly next?: string
  readonly error?: string
  readonly aff?: string | null
}

function buildAuthPath(path: string, options: AuthPathOptions): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(options)) {
    if (value) params.set(key, value)
  }

  const query = params.toString()
  return query ? `${path}?${query}` : path
}

export function signInPath(options: Pick<AuthPathOptions, 'next' | 'aff'> = {}): string {
  return buildAuthPath(paths.signIn, options)
}

export function signUpPath(options: AuthPathOptions = {}): string {
  return buildAuthPath(paths.signUp, options)
}

export function invitePath(inviteCode: string): string {
  return signUpPath({ aff: inviteCode })
}

export function getAbsoluteUrl(path: string): string {
  return typeof window !== 'undefined' ? `${window.location.origin}${path}` : path
}

export const chatHref = (issue: Issue) => paths.post(issue.author?.login ?? '', issue.number)
