'use client'

import React, { use, useMemo } from 'react'

interface AuthContextProps {
  isAuth: boolean
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
}: {
  children: React.ReactNode
  isAuth: boolean
}) {
  const contextValue = useMemo(() => ({
    isAuth,
  }), [isAuth])

  return (
    <AuthContext value={contextValue}>
      {children}
    </AuthContext>
  )
}
export { AuthProvider, useAuth }
