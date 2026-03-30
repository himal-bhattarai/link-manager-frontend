/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['"Bricolage Grotesque"', 'sans-serif'], // override Tailwind default
        display: ['"Bricolage Grotesque"', 'sans-serif'],
        body:    ['"Bricolage Grotesque"', 'sans-serif'],
        code:    ['"JetBrains Mono"', 'monospace'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        charcoal: '#1c1c1a',
        sand: '#d4d0c0',
        parchment: '#e8e4d4',
        coral: { DEFAULT: '#e8604c', light: '#f07060', dark: '#c44030' },
        ivory:   '#f0ece0',
        mist:    '#a8a498',
        muted:   '#6b6b5a',
        surface: '#242420',
        panel:   '#2c2c28',
        edge:    '#6b6b5a',
      },
      animation: {
        'fade-up':    'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'shake':      'shake 0.45s cubic-bezier(0.36,0.07,0.19,0.97)',
        'scale-in':   'scaleIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'slide-left': 'slideLeft 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
      },
      keyframes: {
        fadeUp:    { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.95)' }, to: { opacity: '1', transform: 'scale(1)' } },
        slideLeft: { from: { opacity: '0', transform: 'translateX(28px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
