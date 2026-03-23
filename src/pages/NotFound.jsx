import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundColor: '#1c1c1a' }}>

      {/* Concentric arcs — centered */}
      <div className="absolute pointer-events-none" style={{ color: '#242420' }}>
        {[600, 480, 360, 240, 130].map((s) => (
          <div key={s} className="arc absolute"
            style={{ width: s, height: s, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        ))}
      </div>

      {/* Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(#f0ece0 1px, transparent 1px), linear-gradient(90deg, #f0ece0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }} />

      <div className="relative z-10 text-center animate-fade-up" style={{ animationFillMode: 'forwards' }}>
        {/* Big 404 */}
        <div className="font-display font-800 leading-none mb-6 select-none"
          style={{ fontSize: 'clamp(6rem, 20vw, 14rem)', color: '#242420', letterSpacing: '-0.04em' }}>
          404
        </div>

        {/* Coral accent line */}
        <div className="w-12 h-0.5 mx-auto mb-6" style={{ backgroundColor: '#e8604c' }} />

        <h1 className="font-display font-700 text-2xl text-ivory mb-3">
          Page not found
        </h1>
        <p className="font-body text-sm mb-10 max-w-xs mx-auto leading-relaxed" style={{ color: '#6b6b5a' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/"
            className="inline-flex items-center gap-2 font-display font-600 text-sm px-5 py-3 rounded-xl transition-all"
            style={{ background: '#f0ece0', color: '#1c1c1a' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
            <ArrowLeft size={14} /> Back to home
          </Link>
          <Link to="/signup"
            className="inline-flex items-center gap-2 font-body font-500 text-sm px-5 py-3 rounded-xl border transition-all"
            style={{ borderColor: '#3a3a34', color: '#a8a498' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8604c'; e.currentTarget.style.color = '#e8604c' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a34'; e.currentTarget.style.color = '#a8a498' }}>
            Create an account
          </Link>
        </div>
      </div>

      {/* Bottom wordmark */}
      <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
        <div className="w-4 h-4 rounded-full border flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
          <div className="w-1 h-1 rounded-full" style={{ backgroundColor: '#e8604c' }} />
        </div>
        <span className="font-display font-600 text-xs" style={{ color: '#6b6b5a' }}>Urlix</span>
      </div>
    </div>
  )
}
