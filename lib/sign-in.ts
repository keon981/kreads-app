'use client'

import { authClient } from '@/lib/auth-client' // import the auth client

export function signInWithGitHub() {
  return authClient.signIn.social({
    provider: 'github',
    callbackURL: '/',
    // errorCallbackURL: '/error',
    // newUserCallbackURL: '/welcome',
  })
}
