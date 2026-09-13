'use client'

import React, { use, useMemo } from 'react'

interface AuthContextProps {
  isAuth: boolean
  user: null | {
    id: string | undefined
    name: string | null | undefined
    avatarUrl: string | undefined
  }
}

const AuthContext = React.createContext<AuthContextProps | null>(null)

function useAuth() {
  const context = use(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider.')
  }

  return context
}

function AuthProvider({
  children,
  isAuth,
  user,
}: {
  children: React.ReactNode
} & AuthContextProps) {
  const contextValue = useMemo(() => isAuth
    ? ({
      isAuth,
      user,
    })
    : ({
      isAuth,
      user: null,
    }), [isAuth, user])

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  )
}
export { AuthProvider, useAuth }
