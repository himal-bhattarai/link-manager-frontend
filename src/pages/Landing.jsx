import { Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'

const DEMO_LINKS = [
  { label: 'Portfolio', url: 'mysite.dev',      color: '#e8604c' },
  { label: 'GitHub',    url: 'github.com/you',   color: '#a8a498' },
  { label: 'Writing',   url: 'substack.com/you', color: '#6b6b5a' },
  { label: 'Resume',    url: 'read.cv/you',      color: '#6b6b5a' },
]

export default function Landing() {
  return (
    <div className="min-h-dvh overflow-x-hidden" style={{ backgroundColor: '#1c1c1a' }}>

      {/* Grid texture */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: 'linear-gradient(#f0ece0 1px, transparent 1px), linear-gradient(90deg, #f0ece0 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }} />

      {/* Arcs — bottom right */}
      <div className="fixed bottom-[-140px] right-[-140px] pointer-events-none" style={{ color: '#2c2c28' }}>
        {[500, 400, 300, 200, 110].map((s) => (
          <div key={s} className="arc absolute"
            style={{ width: s, height: s, bottom: 0, right: 0, transform: 'translate(50%,50%)' }} />
        ))}
      </div>

      {/* ── Sticky Navbar ── */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 sm:px-12 h-16 border-b"
        style={{ backgroundColor: '#1c1c1a', borderColor: '#2c2c28', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
          </div>
          <span className="font-display font-700 text-ivory text-base">Lynktree</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login"
            className="text-sm font-body font-500 transition-colors px-3 py-1.5 rounded-lg"
            style={{ color: '#a8a498' }}
            onMouseEnter={e => e.currentTarget.style.color = '#f0ece0'}
            onMouseLeave={e => e.currentTarget.style.color = '#a8a498'}>
            Sign in
          </Link>
          <Link to="/signup"
            className="text-sm font-display font-600 px-4 py-2 rounded-xl transition-all"
            style={{ background: '#f0ece0', color: '#1c1c1a' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pt-24 pb-20">
        <div className="max-w-2xl">
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 border text-xs font-body font-500 opacity-0 animate-fade-up"
            style={{ background: 'rgba(232,96,76,0.08)', borderColor: 'rgba(232,96,76,0.2)', color: '#e8604c', animationFillMode: 'forwards' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
            Free forever · no credit card
          </div>

          {/* Headline */}
          <h1 className="font-display font-800 leading-[0.9] mb-7 opacity-0 animate-fade-up delay-100"
            style={{ fontSize: 'clamp(3.2rem, 7vw, 6rem)', color: '#f0ece0', animationFillMode: 'forwards' }}>
            All your links.<br />
            <span style={{ color: '#e8604c' }}>One address.</span>
          </h1>

          <p className="font-body text-lg leading-relaxed mb-10 max-w-md opacity-0 animate-fade-up delay-200"
            style={{ color: '#a8a498', animationFillMode: 'forwards' }}>
            Share your portfolio, GitHub, socials, and anything else — from a single clean page at{' '}
            <span style={{ color: '#f0ece0' }}>lynktree.io/@you</span>
          </p>

          <div className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-up delay-300" style={{ animationFillMode: 'forwards' }}>
            <Link to="/signup"
              className="inline-flex items-center gap-2 font-display font-600 text-sm px-6 py-3.5 rounded-xl transition-all"
              style={{ background: '#f0ece0', color: '#1c1c1a' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e8604c'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#f0ece0'; e.currentTarget.style.color = '#1c1c1a' }}>
              Claim your link <ArrowRight size={15} />
            </Link>
            <Link to="/login"
              className="inline-flex items-center gap-1.5 font-body font-500 text-sm transition-colors"
              style={{ color: '#a8a498' }}
              onMouseEnter={e => e.currentTarget.style.color = '#f0ece0'}
              onMouseLeave={e => e.currentTarget.style.color = '#a8a498'}>
              Already have an account →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Preview + Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 sm:px-12 pb-28">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: mock browser */}
          <div className="rounded-2xl border overflow-hidden opacity-0 animate-fade-up delay-400"
            style={{ background: '#242420', borderColor: '#3a3a34', animationFillMode: 'forwards' }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: '#3a3a34', background: '#1c1c1a' }}>
              <div className="flex gap-1.5">
                {['#f87171', '#fbbf24', '#4ade80'].map(c => (
                  <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                ))}
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md text-xs font-code text-center"
                style={{ background: '#2c2c28', color: '#6b6b5a' }}>
                lynktree.io/@yourname
              </div>
            </div>
            {/* Profile content */}
            <div className="px-6 py-8">
              <div className="flex flex-col items-center text-center mb-7">
                <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center font-display font-700 text-2xl text-white"
                  style={{ background: '#e8604c' }}>Y</div>
                <h3 className="font-display font-700 text-ivory text-lg">Your Name</h3>
                <p className="font-code text-xs mt-1" style={{ color: '#6b6b5a' }}>@yourname</p>
                <p className="font-body text-sm mt-2" style={{ color: '#a8a498' }}>Designer & developer</p>
              </div>
              <div className="space-y-2.5">
                {DEMO_LINKS.map((link, i) => (
                  <div key={link.label}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                    style={{ background: '#1c1c1a', borderColor: '#3a3a34', opacity: 1 - i * 0.1 }}>
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: link.color }} />
                    <span className="font-body font-500 text-sm flex-1" style={{ color: '#f0ece0' }}>{link.label}</span>
                    <span className="font-code text-xs" style={{ color: '#3a3a34' }}>{link.url}</span>
                    <ExternalLink size={11} style={{ color: '#3a3a34' }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: features */}
          <div className="space-y-8">
            {[
              { num: '01', title: 'One link for everything', body: 'Share a single URL on your bio, email signature, or business card. Everything you make lives there.', ms: 500 },
              { num: '02', title: 'Drag to reorder',         body: 'Arrange your links exactly how you want. Changes go live instantly.',                                    ms: 620 },
              { num: '03', title: 'See what gets clicked',   body: 'Built-in click tracking shows you which links your audience actually uses.',                             ms: 740 },
            ].map((f) => (
              <div key={f.num}
                className="flex gap-5 opacity-0 animate-fade-up"
                style={{ animationDelay: `${f.ms}ms`, animationFillMode: 'forwards' }}>
                <span className="font-code text-xs shrink-0 mt-1" style={{ color: '#e8604c' }}>{f.num}</span>
                <div>
                  <h3 className="font-display font-600 text-ivory text-base mb-1">{f.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#6b6b5a' }}>{f.body}</p>
                </div>
              </div>
            ))}

            <div className="opacity-0 animate-fade-up" style={{ animationDelay: '860ms', animationFillMode: 'forwards' }}>
              <Link to="/signup"
                className="inline-flex items-center gap-2 font-display font-600 text-sm px-5 py-3 rounded-xl transition-all"
                style={{ background: '#2c2c28', color: '#f0ece0', border: '1px solid #3a3a34' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#e8604c'; e.currentTarget.style.color = '#e8604c' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a34'; e.currentTarget.style.color = '#f0ece0' }}>
                Start for free <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t px-6 sm:px-12 py-6 flex items-center justify-between flex-wrap gap-4"
        style={{ backgroundColor: '#1c1c1a', borderColor: '#2c2c28' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full border flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e8604c' }} />
          </div>
          <span className="font-display font-600 text-sm" style={{ color: '#a8a498' }}>Lynktree</span>
        </div>

        <p className="font-body text-xs" style={{ color: '#6b6b5a' }}>
          Your links. Your page. Free forever.
        </p>

        <a href="https://github.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-body text-xs transition-colors"
          style={{ color: '#6b6b5a' }}
          onMouseEnter={e => e.currentTarget.style.color = '#f0ece0'}
          onMouseLeave={e => e.currentTarget.style.color = '#6b6b5a'}>
          <Github size={15} />
          GitHub
        </a>
      </footer>
    </div>
  )
}
