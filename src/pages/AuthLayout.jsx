import { Outlet, Link, useLocation } from 'react-router-dom'

const PREVIEW_LINKS = [
  { label: 'Portfolio', hint: 'yoursite.com',     color: '#e8604c' },
  { label: 'GitHub',    hint: 'github.com/you',   color: '#a8a498' },
  { label: 'Writing',   hint: 'substack.com/you', color: '#6b6b5a' },
]

export default function AuthLayout() {
  const { pathname } = useLocation()
  const isLogin = pathname === '/login'

  return (
    <div className="h-dvh flex overflow-hidden" style={{ backgroundColor: '#1c1c1a' }}>

      {/* ── Left panel — stays mounted, never shifts ── */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between p-14 relative overflow-hidden flex-shrink-0"
        style={{ backgroundColor: '#1c1c1a' }}>

        {/* Arcs */}
        <div className="absolute bottom-[-120px] right-[-120px] pointer-events-none" style={{ color: '#2c2c28' }}>
          {[280, 220, 160, 100, 44].map((s) => (
            <div key={s} className="arc absolute"
              style={{ width: s, height: s, bottom: 0, right: 0, transform: 'translate(50%,50%)' }} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-14">
            <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e8604c' }} />
            </div>
            <span className="font-display font-700 text-ivory text-lg">Lynktree</span>
          </div>

          {/* Headline transitions smoothly via opacity */}
          <div style={{ transition: 'opacity 0.2s ease' }}>
            <h2 className="font-display font-800 leading-[0.92] mb-6"
              style={{ fontSize: 'clamp(2.6rem, 4vw, 3.8rem)', color: '#f0ece0' }}>
              {isLogin ? (
                <>welcome to<br />your <em className="not-italic" style={{ color: '#e8604c' }}>corner</em><br />of the web.</>
              ) : (
                <>one link.<br /><span style={{ color: '#e8604c' }}>all of you.</span></>
              )}
            </h2>
            <p className="font-body text-sm leading-relaxed max-w-xs" style={{ color: '#a8a498' }}>
              {isLogin
                ? 'One link. Every place you exist online — portfolio, socials, projects — all in one clean page.'
                : 'Share your GitHub, portfolio, socials — from a single beautiful page.'}
            </p>
          </div>
        </div>

        {/* Preview links */}
        <div className="relative z-10 space-y-2.5">
          {PREVIEW_LINKS.map((item, i) => (
            <div key={item.label}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border"
              style={{ background: '#242420', borderColor: '#3a3a34', opacity: 1 - i * 0.2 }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="font-body font-500 text-ivory text-sm">{item.label}</span>
              <span className="font-code text-xs ml-auto" style={{ color: '#6b6b5a' }}>{item.hint}</span>
            </div>
          ))}
          <p className="font-code text-xs pt-2 pl-1" style={{ color: '#3a3a34' }}>lynktree.io/@yourname</p>
        </div>
      </div>

      {/* ── Right panel — form swaps here, bg stays constant ── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#242420' }}>
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
