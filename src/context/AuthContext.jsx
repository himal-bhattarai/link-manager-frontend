import { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [authReady, setAuthReady] = useState(false) // true once /auth/me has resolved

  // On mount: silently restore session from cookie.
  // Public pages (/, /login, /signup, /@username) don't wait for this —
  // they render immediately. Only ProtectedRoute waits via authReady.
  useEffect(() => {
    api.get('/auth/me')
      .then((data) => setUser(data.data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthReady(true))
  }, [])

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password })
    setUser(data.data.user)
    return data.data.user
  }

  const register = async (fields) => {
    const data = await api.post('/auth/register', fields)
    setUser(data.data.user)
    return data.data.user
  }

  const logout = async () => {
    await api.post('/auth/logout')
    setUser(null)
  }

  const updateUser = (updates) => setUser((u) => ({ ...u, ...updates }))

  return (
    <AuthContext.Provider value={{ user, authReady, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
