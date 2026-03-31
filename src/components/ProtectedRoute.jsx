import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Spinner = () => (
  <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: '#1c1c1a' }}>
    <div className="w-5 h-5 border-2 rounded-full animate-spin"
      style={{ borderColor: '#3a3a34', borderTopColor: '#e8604c' }} />
  </div>
)

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useAuth()

  // Wait for the on-mount /auth/me to finish before deciding
  if (!authReady) return <Spinner />

  return user ? children : <Navigate to="/login" replace />
}
