import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const PANELS = {
  '/login': {
    tag: '✦ Share everything in one link',
    headline: ['welcome to', 'your ', 'corner', ' of the web.'],
    sub: 'One link. Every place you exist online — portfolio, socials, projects — all in one clean page.',
    links: [
      { label: 'Portfolio', hint: 'yoursite.com' },
      { label: 'GitHub',    hint: 'github.com/you' },
      { label: 'Writing',   hint: 'substack.com/you' },
    ],
  },
  '/signup': {
    tag: '✦ Free forever · no credit card',
    headline: ['one link.', '', 'all of you.', ''],
    sub: 'Share your portfolio, GitHub, socials and anything else — from a single beautiful page.',
    links: [
      { label: 'Portfolio', hint: 'mysite.dev' },
      { label: 'GitHub',    hint: 'github.com/you' },
      { label: 'Twitter',   hint: 'x.com/you' },
    ],
  },
}

// Mounts a fresh copy each time `id` changes — guarantees animation re-runs
function AnimatedPanel({ id, children }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    setVisible(false)
    const t = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
    return () => cancelAnimationFrame(t)
  }, [id])

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(14px)',
      transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
    }}>
      {children}
    </div>
  )
}

export default function AuthLayout({ children }) {
  const { pathname } = useLocation()
  const panel = PANELS[pathname] || PANELS['/login']
  const isLogin = pathname === '/login'

  return (
    <div className="h-dvh flex overflow-hidden" style={{ backgroundColor: '#1c1c1a' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-[42%] flex-col justify-between p-16 relative overflow-hidden flex-shrink-0"
        style={{ backgroundColor: '#1c1c1a' }}>

        {/* Arcs — static, never re-animate */}
        <div className="absolute bottom-[-120px] right-[-120px] pointer-events-none" style={{ color: '#2c2c28' }}>
          {[280, 220, 160, 100, 44].map((s) => (
            <div key={s} className="arc absolute"
              style={{ width: s, height: s, bottom: 0, right: 0, transform: 'translate(50%,50%)' }} />
          ))}
        </div>

        {/* Top content — animates on route change */}
        <AnimatedPanel id={pathname + '-top'}>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#e8604c' }}>
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#e8604c' }} />
              </div>
              <span className="font-display font-700 text-ivory text-lg tracking-tight">Lynktree</span>
            </div>

            {/* Tag pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 border text-xs font-body"
              style={{ background: 'rgba(232,96,76,0.08)', borderColor: 'rgba(232,96,76,0.2)', color: '#e8604c' }}>
              {panel.tag}
            </div>

            {/* Headline */}
            {isLogin ? (
              <h2 className="font-display font-800 leading-[0.92] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 3.2vw, 3.6rem)', color: '#f0ece0' }}>
                welcome to<br />
                your <em className="not-italic" style={{ color: '#e8604c' }}>corner</em><br />
                of the web.
              </h2>
            ) : (
              <h2 className="font-display font-800 leading-[0.92] mb-5"
                style={{ fontSize: 'clamp(2.4rem, 3.2vw, 3.6rem)', color: '#f0ece0' }}>
                one link.<br />
                <em className="not-italic" style={{ color: '#e8604c' }}>all of you.</em>
              </h2>
            )}

            <p className="font-body text-sm leading-relaxed max-w-xs" style={{ color: '#a8a498' }}>
              {panel.sub}
            </p>
          </div>
        </AnimatedPanel>

        {/* Bottom preview links — animates with delay */}
        <AnimatedPanel id={pathname + '-links'}>
          <div className="relative z-10 space-y-2.5" style={{ transitionDelay: '80ms' }}>
            {panel.links.map((item, i) => (
              <div key={item.label}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border"
                style={{ background: '#242420', borderColor: '#3a3a34', opacity: 1 - i * 0.2 }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#e8604c' }} />
                <span className="font-body font-500 text-ivory text-sm">{item.label}</span>
                <span className="font-code text-xs ml-auto" style={{ color: '#6b6b5a' }}>{item.hint}</span>
              </div>
            ))}
            <p className="font-code text-xs pt-2 pl-1" style={{ color: '#3a3a34' }}>lynktree.io/@yourname</p>
          </div>
        </AnimatedPanel>
      </div>

      {/* ── Right panel — animates on route change ── */}
      <div className="flex-1 flex flex-col overflow-y-auto" style={{ backgroundColor: '#242420' }}>
        <div className="flex-1 flex items-center justify-center px-8 py-10">
          <AnimatedPanel id={pathname + '-form'}>
            <div className="w-full max-w-sm">
              {children}
            </div>
          </AnimatedPanel>
        </div>
      </div>
    </div>
  )
}
