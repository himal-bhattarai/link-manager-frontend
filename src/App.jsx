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

function HandleRoute() {
  const { handle } = useParams()
  if (handle?.startsWith('@')) return <PublicProfile username={handle.slice(1)} />
  return <NotFound />
}

function AppRoutes() {
  const { user, authReady } = useAuth()
  return (
    <Routes>
      {/* Root — once auth resolves, redirect logged-in users to dashboard */}
      <Route path="/" element={
        authReady && user ? <Navigate to="/dashboard" replace /> : <Landing />
      } />
      <Route path="/login"     element={<Login />} />
      <Route path="/signup"    element={<Signup />} />
      <Route path="/:handle"   element={<HandleRoute />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="*"          element={<NotFound />} />
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
