import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ExternalLink, Share2, Check, Link2, AlertCircle, Copy, Twitter } from 'lucide-react'
import api from '../lib/api'

function NotFound({ username }) {
  return (
    <div className="max-w-sm mx-auto px-4 pt-28 pb-12 text-center animate-fade-up" style={{ animationFillMode: 'forwards' }}>
      <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center border"
        style={{ background: '#242420', borderColor: '#3a3a34' }}>
        <AlertCircle size={20} style={{ color: '#3a3a34' }} />
      </div>
      <h1 className="font-display font-700 text-2xl text-ivory mb-2">@{username} not found</h1>
      <p className="font-body text-mist text-sm mb-7">This profile doesn't exist or has been removed.</p>
      <Link to="/signup"
        className="inline-flex items-center gap-2 font-display font-600 text-sm px-5 py-2.5 rounded-xl transition-all"
        style={{ background: '#f0ece0', color: '#1c1c1a' }}
        onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
        onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
        Claim your link →
      </Link>
    </div>
  )
}

function ShareMenu({ url, username }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const copy = () => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => { setCopied(false); setOpen(false) }, 1800) }

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-body font-500 border rounded-lg px-3 py-1.5 transition-all"
        style={{ background: '#242420', borderColor: '#3a3a34', color: '#a8a498' }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#e8604c'}
        onMouseLeave={e => e.currentTarget.style.borderColor = '#3a3a34'}>
        <Share2 size={12} /> Share
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 border rounded-xl p-1.5 z-50 animate-scale-in"
          style={{ background: '#1c1c1a', borderColor: '#3a3a34', animationFillMode: 'forwards' }}>
          <button onClick={copy}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body rounded-lg transition-all"
            style={{ color: '#a8a498' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#242420'; e.currentTarget.style.color = '#f0ece0' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a8a498' }}>
            {copied ? <Check size={12} style={{ color: '#e8604c' }} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy link'}
          </button>
          <button onClick={() => { window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out @${username}'s links`, '_blank'); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-body rounded-lg transition-all"
            style={{ color: '#a8a498' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#242420'; e.currentTarget.style.color = '#f0ece0' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a8a498' }}>
            <Twitter size={12} /> Share on X
          </button>
        </div>
      )}
    </div>
  )
}

function LinkButton({ link, index }) {
  const [hovered, setHovered] = useState(false)

  const handleClick = async () => {
    try { await api.post(`/links/${link._id}/click`) } catch {}
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button onClick={handleClick}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      className="w-full rounded-xl px-5 py-4 flex items-center gap-4 text-left transition-all duration-150 active:scale-[0.99] animate-fade-up opacity-0"
      style={{
        background: hovered ? '#2c2c28' : '#242420',
        border: `1px solid ${hovered ? '#e8604c' : '#3a3a34'}`,
        animationDelay: `${index * 60}ms`,
        animationFillMode: 'forwards',
      }}>

      {/* Number */}
      <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-code font-500 shrink-0 transition-all"
        style={{
          background: hovered ? 'rgba(232,96,76,0.15)' : '#1c1c1a',
          border: `1px solid ${hovered ? 'rgba(232,96,76,0.3)' : '#3a3a34'}`,
          color: hovered ? '#e8604c' : '#3a3a34',
        }}>
        {String(index + 1).padStart(2, '0')}
      </span>

      <span className="flex-1 min-w-0">
        <span className="block text-sm font-body font-600 truncate transition-colors"
          style={{ color: hovered ? '#f0ece0' : '#d4d0c0' }}>
          {link.title}
        </span>
        <span className="block text-xs font-code truncate transition-colors"
          style={{ color: hovered ? '#a8a498' : '#3a3a34' }}>
          {link.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </span>
      </span>

      <ExternalLink size={13} className="shrink-0 transition-all duration-150"
        style={{ color: hovered ? '#e8604c' : '#3a3a34', transform: hovered ? 'translate(2px,-2px)' : 'none' }} />
    </button>
  )
}

export default function PublicProfile({ username: usernameProp }) {
  const params = useParams()
  const username = usernameProp || params.username
  const [profile, setProfile] = useState(null)
  const [links, setLinks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    api.get(`/users/${username}`)
      .then((res) => {
        const profile = res?.data?.profile || res?.profile
        const links   = res?.data?.links   || res?.links || []
        if (!profile) { setNotFound(true); return }
        setProfile(profile)
        setLinks(links)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [username])

  return (
    <div className="min-h-dvh" style={{ backgroundColor: '#1c1c1a' }}>
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 h-12 flex items-center justify-between px-6 border-b"
        style={{ background: 'rgba(28,28,26,0.85)', borderColor: '#2c2c28', backdropFilter: 'blur(12px)' }}>
        <Link to="/" className="flex items-center gap-2 transition-opacity opacity-50 hover:opacity-100">
          <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
          </div>
          <span className="font-display font-700 text-xs text-ivory">Urlix</span>
        </Link>
        {!loading && !notFound && <ShareMenu url={window.location.href} username={username} />}
      </div>

      <main className="pt-12">
        {loading ? (
          <div className="max-w-sm mx-auto px-4 pt-16 space-y-4 animate-fade-in">
            <div className="flex flex-col items-center gap-3 mb-8">
              <div className="w-20 h-20 rounded-2xl animate-pulse" style={{ background: '#242420' }} />
              <div className="h-5 w-36 rounded-lg animate-pulse" style={{ background: '#242420' }} />
              <div className="h-3 w-48 rounded-lg animate-pulse" style={{ background: '#242420' }} />
            </div>
            {[1,2,3,4].map(i => <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: '#242420', opacity: 1 - i * 0.2 }} />)}
          </div>
        ) : notFound ? (
          <NotFound username={username} />
        ) : (
          <div className="max-w-sm mx-auto px-4 pt-10 pb-16">

            {/* Profile */}
            <div className="flex flex-col items-center text-center mb-10 animate-fade-up" style={{ animationFillMode: 'forwards' }}>
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.displayName}
                  className="w-20 h-20 rounded-2xl object-cover mb-4"
                  style={{ border: '2px solid #3a3a34' }} />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-display font-700 text-3xl text-white mb-4"
                  style={{ background: '#e8604c' }}>
                  {profile.displayName?.[0]?.toUpperCase()}
                </div>
              )}

              <h1 className="font-display font-700 text-2xl text-ivory mb-1">{profile.displayName}</h1>
              <span className="font-code text-xs mb-3" style={{ color: '#3a3a34' }}>@{profile.username}</span>
              {profile.bio && <p className="font-body text-sm leading-relaxed max-w-[260px]" style={{ color: '#a8a498' }}>{profile.bio}</p>}

              {links.length > 0 && (
                <div className="tag mt-4" style={{ background: 'rgba(232,96,76,0.1)', color: '#e8604c', border: '1px solid rgba(232,96,76,0.2)' }}>
                  {links.length} link{links.length !== 1 ? 's' : ''}
                </div>
              )}
            </div>

            {/* Links */}
            {links.length === 0 ? (
              <div className="text-center py-12">
                <Link2 size={20} className="mx-auto mb-2" style={{ color: '#3a3a34' }} />
                <p className="font-body text-sm" style={{ color: '#3a3a34' }}>No links added yet.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {links.map((link, i) => <LinkButton key={link._id} link={link} index={i} />)}
              </div>
            )}

            {/* Footer arcs + branding */}
            <div className="mt-16 flex flex-col items-center gap-4 relative overflow-hidden pb-4">
              {/* Mini concentric arcs */}
              <div className="relative w-16 h-8 overflow-hidden">
                {[64, 44, 28].map(s => (
                  <div key={s} className="absolute rounded-full border"
                    style={{ width: s, height: s, bottom: 0, left: '50%', transform: 'translateX(-50%)', borderColor: '#3a3a34' }} />
                ))}
              </div>
              <Link to="/signup" className="text-xs font-body transition-colors" style={{ color: '#3a3a34' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8604c'}
                onMouseLeave={e => e.currentTarget.style.color = '#3a3a34'}>
                Create your own Urlix →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
