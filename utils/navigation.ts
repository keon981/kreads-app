export function safeNext(next: string | null | undefined, fallback = '/') {
  if (!next || !next.startsWith('/') || next.startsWith('//')) return fallback

  return next
}

export function signInPath(next?: string) {
  if (!next) return '/sign-in'

  return `/sign-in?${new URLSearchParams({ next })}`
}

export function signUpPath(next?: string, error?: string) {
  if (!next) return '/sign-up'

  const params = new URLSearchParams({ next })
  if (error) params.set('error', error)
  return `/sign-up?${params}`
}
