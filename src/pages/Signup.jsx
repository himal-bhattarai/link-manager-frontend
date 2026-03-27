import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Check, X, AtSign, User, Mail, Lock, CircleCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../components/AuthLayout'
import api from '../lib/api'
import toast from 'react-hot-toast'

const rules = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'One uppercase letter',  test: (p) => /[A-Z]/.test(p) },
  { label: 'One number',            test: (p) => /[0-9]/.test(p) },
]

export default function Signup() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '', displayName: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')
  const [usernameState, setUsernameState] = useState('idle')
  const debounceRef = useRef(null)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  useEffect(() => {
    const u = form.username.trim()
    if (u.length < 3 || !/^[a-zA-Z0-9_]+$/.test(u)) { setUsernameState('idle'); return }
    setUsernameState('checking')
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      try {
        const data = await api.get(`/auth/check-username/${u}`)
        setUsernameState(data.data.available ? 'available' : 'taken')
      } catch { setUsernameState('idle') }
    }, 500)
  }, [form.username])

  const submit = async (e) => {
    e.preventDefault()
    if (usernameState === 'taken') { toast.error('Username already taken'); return }
    setLoading(true)
    try {
      await register(form)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = (name, extra = {}) => ({
    background: '#2c2c28',
    borderWidth: '1.5px',
    borderStyle: 'solid',
    borderColor: focused === name ? '#e8604c' : '#3a3a34',
    boxShadow: focused === name ? '0 0 0 3px rgba(232,96,76,0.12)' : 'none',
    ...extra,
  })

  return (
    <AuthLayout>
      {/* Mobile logo */}
      <div className="flex items-center gap-2.5 mb-6 lg:hidden">
        <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
        </div>
        <span className="font-display font-700 text-ivory">Lynktree</span>
      </div>

      <h2 className="font-display font-700 text-3xl text-ivory mb-1">Get started</h2>
      <p className="font-body text-sm mb-5" style={{ color: '#a8a498' }}>Create your free account</p>

      <form onSubmit={submit} className="space-y-3.5">

        {/* Username */}
        <div>
          <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Username</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <AtSign size={14} style={{ color: focused === 'username' ? '#e8604c' : '#6b6b5a' }} />
            </span>
            <input name="username" required minLength={3} maxLength={30}
              value={form.username} onChange={handle}
              onFocus={() => setFocused('username')} onBlur={() => setFocused('')}
              placeholder="yourname"
              className="w-full rounded-xl pl-11 pr-11 py-2.5 text-sm text-ivory placeholder-edge outline-none transition-all font-code"
              style={inputStyle('username', {
                borderColor: usernameState === 'taken'     ? '#f87171'
                           : usernameState === 'available' ? '#4ade80'
                           : focused === 'username'        ? '#e8604c' : '#3a3a34',
              })} />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center w-4 h-4">
              {usernameState === 'checking' && (
                <span className="w-3.5 h-3.5 border-2 rounded-full animate-spin block"
                  style={{ borderColor: '#3a3a34', borderTopColor: '#e8604c' }} />
              )}
              {usernameState === 'available' && <CircleCheck size={16} style={{ color: '#4ade80' }} strokeWidth={2} />}
              {usernameState === 'taken'     && <X size={15} style={{ color: '#f87171' }} strokeWidth={2.5} />}
            </span>
          </div>
          {usernameState === 'available' && (
            <p className="text-xs mt-1 font-code flex items-center gap-1" style={{ color: '#4ade80' }}>
              <CircleCheck size={11} strokeWidth={2} /> @{form.username} is available
            </p>
          )}
          {usernameState === 'taken' && (
            <p className="text-xs mt-1 font-body" style={{ color: '#f87171' }}>Already taken — try another</p>
          )}
        </div>

        {/* Display name */}
        <div>
          <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Display name</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: focused === 'dn' ? '#e8604c' : '#6b6b5a' }}>
              <User size={14} />
            </span>
            <input name="displayName" value={form.displayName} onChange={handle}
              onFocus={() => setFocused('dn')} onBlur={() => setFocused('')}
              placeholder="Your Name"
              className="w-full rounded-xl pl-11 pr-4 py-2.5 text-sm text-ivory outline-none transition-all font-body"
              style={inputStyle('dn')} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Email</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: focused === 'email' ? '#e8604c' : '#6b6b5a' }}>
              <Mail size={14} />
            </span>
            <input name="email" type="email" required value={form.email} onChange={handle}
              onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
              placeholder="you@example.com"
              className="w-full rounded-xl pl-11 pr-4 py-2.5 text-sm text-ivory outline-none transition-all font-body"
              style={inputStyle('email')} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-600 mb-1.5 uppercase tracking-widest" style={{ color: '#a8a498' }}>Password</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
              style={{ color: focused === 'pw' ? '#e8604c' : '#6b6b5a' }}>
              <Lock size={14} />
            </span>
            <input name="password" type={showPass ? 'text' : 'password'} required
              value={form.password} onChange={handle}
              onFocus={() => setFocused('pw')} onBlur={() => setFocused('')}
              placeholder="••••••••"
              className="w-full rounded-xl pl-11 pr-11 py-2.5 text-sm text-ivory outline-none transition-all font-body"
              style={inputStyle('pw')} />
            <button type="button" onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
              style={{ color: '#6b6b5a' }}
              onMouseEnter={e => e.currentTarget.style.color = '#a8a498'}
              onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {form.password.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-3">
              {rules.map((r) => (
                <div key={r.label} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full border flex items-center justify-center transition-all flex-shrink-0"
                    style={{ background: r.test(form.password) ? '#e8604c' : 'transparent', borderColor: r.test(form.password) ? '#e8604c' : '#3a3a34' }}>
                    {r.test(form.password) && <Check size={7} className="text-white" />}
                  </div>
                  <span className="text-xs font-body" style={{ color: r.test(form.password) ? '#a8a498' : '#3a3a34' }}>{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={loading || usernameState === 'taken'}
          className="w-full py-3 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ background: '#f0ece0', color: '#1c1c1a' }}
          onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' } }}
          onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
          {loading
            ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} />
            : <> Create account <ArrowRight size={14} /> </>}
        </button>
      </form>

      <p className="text-center font-body text-sm mt-4" style={{ color: '#a8a498' }}>
        Already in?{' '}
        <Link to="/login" className="font-600 transition-colors" style={{ color: '#e8604c' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f07060'}
          onMouseLeave={e => e.currentTarget.style.color = '#e8604c'}>
          Sign in →
        </Link>
      </p>
    </AuthLayout>
  )
}
