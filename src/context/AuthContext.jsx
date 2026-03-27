import { createContext, useContext, useState } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // No on-mount API call — user state starts null (guest)
  // Auth is checked lazily only when hitting a protected route

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

  // Called by ProtectedRoute — checks session once when dashboard is visited
  const checkAuth = async () => {
    try {
      const data = await api.get('/auth/me')
      setUser(data.data.user)
      return data.data.user
    } catch {
      setUser(null)
      return null
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, checkAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
