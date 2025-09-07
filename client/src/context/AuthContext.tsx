
import React, { createContext, useContext, useEffect, useState } from 'react'

type Role = 'USER' | 'PREMIUM'

type AuthUser = { id: number, username: string, role: Role }
type AuthContextType = {
  user: AuthUser | null
  token: string | null
  login: (u: AuthUser, t: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null, token: null, login: () => {}, logout: () => {}
})

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [user, setUser] = useState<AuthUser|null>(null)
  const [token, setToken] = useState<string|null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('auth')
    if (raw) {
      const saved = JSON.parse(raw)
      setUser(saved.user)
      setToken(saved.token)
    }
  }, [])

  const login = (u: AuthUser, t: string) => {
    setUser(u); setToken(t)
    localStorage.setItem('auth', JSON.stringify({ user: u, token: t }))
  }
  const logout = () => {
    setUser(null); setToken(null)
    localStorage.removeItem('auth')
  }
  return <AuthContext.Provider value={{user, token, login, logout}}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
