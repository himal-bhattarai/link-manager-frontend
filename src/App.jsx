import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import PublicProfile from './pages/PublicProfile'
import NotFound from './pages/NotFound'

const Spinner = () => (
  <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: '#1c1c1a' }}>
    <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#3a3a34', borderTopColor: '#e8604c' }} />
  </div>
)

// Matches /:handle — shows PublicProfile if handle starts with @, else 404
function HandleRoute() {
  const { handle } = useParams()
  if (handle && handle.startsWith('@')) {
    return <PublicProfile username={handle.slice(1)} />
  }
  return <NotFound />
}

function AppRoutes() {
  const { loading, user } = useAuth()

  return (
    <Routes>
      {/* Fully public */}
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Public profile via /@username */}
      <Route path="/:handle" element={<HandleRoute />} />

      {/* Auth-gated */}
      <Route path="/dashboard" element={
        loading ? <Spinner /> : <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      {/* Root — landing for guests, dashboard for logged-in users */}
      <Route path="/" element={
        loading ? <Spinner /> : user ? <Navigate to="/dashboard" replace /> : <Landing />
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#242420',
            color: '#f0ece0',
            border: '1px solid #3a3a34',
            fontSize: '13px',
            fontFamily: '"Bricolage Grotesque", sans-serif',
            borderRadius: '10px',
          },
          success: { iconTheme: { primary: '#e8604c', secondary: '#242420' } },
          error:   { iconTheme: { primary: '#f87171', secondary: '#242420' } },
        }}
      />
    </AuthProvider>
  )
}
