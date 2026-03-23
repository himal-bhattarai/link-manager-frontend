import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, Mail, Lock } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState('')

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-dvh flex overflow-hidden" style={{ backgroundColor: '#1c1c1a' }}>

      {/* ── Left decorative panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-16 relative overflow-hidden flex-shrink-0"
        style={{ backgroundColor: '#1c1c1a' }}>
        {/* Arcs */}
        <div className="absolute bottom-[-120px] right-[-120px] pointer-events-none" style={{ color: '#2c2c28' }}>
          {[280, 220, 160, 100, 44].map((s) => (
            <div key={s} className="arc absolute"
              style={{ width: s, height: s, bottom: 0, right: 0, transform: 'translate(50%,50%)' }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e8604c' }} />
            </div>
            <span className="font-display font-700 text-ivory text-lg tracking-tight">Urlix</span>
          </div>
          <h2 className="font-display font-800 leading-[0.92] mb-6"
            style={{ fontSize: 'clamp(2.8rem, 4vw, 4rem)', color: '#f0ece0' }}>
            welcome to<br />
            your <em className="not-italic" style={{ color: '#e8604c' }}>corner</em><br />
            of the web.
          </h2>
          <p className="font-body text-sm leading-relaxed max-w-xs" style={{ color: '#a8a498' }}>
            One link. Every place you exist online — portfolio, socials, projects — all in one clean page.
          </p>
        </div>

        <div className="relative z-10 space-y-2.5">
          {[
            { label: 'Portfolio', hint: 'yoursite.com' },
            { label: 'GitHub',    hint: 'github.com/you' },
            { label: 'Writing',   hint: 'substack.com/you' },
          ].map((item, i) => (
            <div key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ background: '#242420', borderColor: '#3a3a34', opacity: 1 - i * 0.2 }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#e8604c' }} />
              <span className="font-body font-500 text-ivory text-sm">{item.label}</span>
              <span className="font-code text-mist text-xs ml-auto">{item.hint}</span>
            </div>
          ))}
          <p className="font-code text-xs pt-2 pl-1" style={{ color: '#3a3a34' }}>urlix.io/@yourname</p>
        </div>
      </div>

      {/* ── Right form ── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#242420' }}>
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm animate-fade-up" style={{ animationFillMode: 'forwards' }}>

            {/* Mobile logo */}
            <div className="flex items-center gap-2.5 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
              </div>
              <span className="font-display font-700 text-ivory">Urlix</span>
            </div>

            <h2 className="font-display font-700 text-3xl text-ivory mb-1">Welcome back</h2>
            <p className="font-body text-mist text-sm mb-7">Sign in to your account</p>

            <form onSubmit={submit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-600 mb-2 uppercase tracking-widest" style={{ color: '#a8a498' }}>
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                    style={{ color: focused === 'email' ? '#e8604c' : '#6b6b5a' }}>
                    <Mail size={15} />
                  </span>
                  <input name="email" type="email" required value={form.email} onChange={handle}
                    onFocus={() => setFocused('email')} onBlur={() => setFocused('')}
                    placeholder="you@example.com"
                    className="w-full rounded-xl pl-11 pr-4 py-3 text-sm text-ivory placeholder-edge outline-none transition-all font-body"
                    style={{
                      background: '#2c2c28',
                      borderWidth: '1.5px', borderStyle: 'solid',
                      borderColor: focused === 'email' ? '#e8604c' : '#3a3a34',
                      boxShadow: focused === 'email' ? '0 0 0 3px rgba(232,96,76,0.12)' : 'none',
                    }} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-600 mb-2 uppercase tracking-widest" style={{ color: '#a8a498' }}>
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none transition-colors"
                    style={{ color: focused === 'password' ? '#e8604c' : '#6b6b5a' }}>
                    <Lock size={15} />
                  </span>
                  <input name="password" type={showPass ? 'text' : 'password'} required
                    value={form.password} onChange={handle}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')}
                    placeholder="••••••••"
                    className="w-full rounded-xl pl-11 pr-11 py-3 text-sm text-ivory placeholder-edge outline-none transition-all font-body"
                    style={{
                      background: '#2c2c28',
                      borderWidth: '1.5px', borderStyle: 'solid',
                      borderColor: focused === 'password' ? '#e8604c' : '#3a3a34',
                      boxShadow: focused === 'password' ? '0 0 0 3px rgba(232,96,76,0.12)' : 'none',
                    }} />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: '#6b6b5a' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#a8a498'}
                    onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl font-display font-600 text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
                style={{ background: '#f0ece0', color: '#1c1c1a' }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' } }}
                onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
                {loading
                  ? <span className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'rgba(28,28,26,0.2)', borderTopColor: '#1c1c1a' }} />
                  : <> Sign in <ArrowRight size={15} /> </>}
              </button>
            </form>

            <p className="text-center font-body text-mist text-sm mt-6">
              No account?{' '}
              <Link to="/signup" className="font-600 transition-colors" style={{ color: '#e8604c' }}>
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
