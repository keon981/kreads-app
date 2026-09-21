import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { safeNext } from '@/utils/navigation'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000',
  plugins: [
    adminClient(),
  ],
})

export function authorizeGitHubRepo() {
  return authClient.linkSocial({
    provider: 'github',
    scopes: ['public_repo'],
    callbackURL: '/sign-up',
    errorCallbackURL: '/sign-up',
  })
}

export function signInWithGitHub() {
  const url = new URL(window.location.href)
  const next = safeNext(url.searchParams.get('next') ?? url.pathname + url.search)
  return authClient.signIn.social({
    provider: 'github',
    callbackURL: '/',
    // errorCallbackURL: '/error',
    newUserCallbackURL: `/sign-up?${new URLSearchParams({ next })}`,
  })
}

export async function signOut() {
  await authClient.signOut()
}
