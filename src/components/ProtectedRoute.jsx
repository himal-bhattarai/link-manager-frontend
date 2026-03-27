import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, checkAuth } = useAuth()
  const [checking, setChecking] = useState(!user) // skip check if already logged in

  useEffect(() => {
    if (user) return // already have user, no need to check
    checkAuth().finally(() => setChecking(false))
  }, [])

  if (checking) return (
    <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: '#1c1c1a' }}>
      <div className="w-5 h-5 border-2 rounded-full animate-spin"
        style={{ borderColor: '#3a3a34', borderTopColor: '#e8604c' }} />
    </div>
  )

  return user ? children : <Navigate to="/login" replace />
}
