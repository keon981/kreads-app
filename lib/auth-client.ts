import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000',
})

export function signInWithGitHub() {
  return authClient.signIn.social({
    provider: 'github',
    callbackURL: '/',
    // errorCallbackURL: '/error',
    newUserCallbackURL: '/auth/register',
  })
}

export async function signOut() {
  await authClient.signOut()
}
