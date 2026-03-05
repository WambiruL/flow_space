import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#3C1518',   // deepest — page background
          secondary: '#451A1D',   // sidebar, slightly raised
          tertiary:  '#521E10',   // elevated panels
          card:      '#4A1A1C',   // card surface
          hover:     '#5C2420',   // card hover / focus
        },
        border: {
          subtle:  '#6B2420',
          default: '#7D2D20',
          strong:  '#A44200',
        },
        text: {
          primary:   '#F2F3AE',   // cream — headings, main text
          secondary: '#C8C97A',   // dimmed cream
          muted:     '#8A8A45',   // muted / placeholders
          accent:    '#F2F3AE',
        },
        rust: {
          pale:    '#E8855A',     // light rust — hover states
          mid:     '#C05020',     // mid rust
          vivid:   '#A44200',     // primary CTA
          deep:    '#7A3200',     // pressed / deep
          glow:    '#A4420020',
          'glow-sm': '#A4420012',
        },
        amber: {
          pale:   '#F2F3AE',      // same as cream — used on amber contexts
          soft:   '#E8B84B',      // softer amber
          mid:    '#D58936',      // primary amber accent
          deep:   '#B06B20',
          glow:   '#D5893620',
        },
        crimson: {
          dark:   '#69140E',
          mid:    '#7D1A10',
          light:  '#A02818',
        },
        status: {
          active:    '#D58936',   // amber for active
          paused:    '#C8C97A',   // dimmed cream for paused
          completed: '#E8B84B',   // golden for completed
          high:      '#E85A3A',   // bright rust-red for high priority
          low:       '#C8C97A',   // muted for low
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body:    ['var(--font-body)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      backgroundImage: {
        'gradient-primary':   'linear-gradient(135deg, #A44200 0%, #D58936 100%)',
        'gradient-crimson':   'linear-gradient(135deg, #69140E 0%, #A44200 100%)',
        'gradient-amber':     'linear-gradient(135deg, #D58936 0%, #F2F3AE 100%)',
        'gradient-card':      'linear-gradient(160deg, #4A1A1C 0%, #3C1518 100%)',
        'gradient-sidebar':   'linear-gradient(180deg, #451A1D 0%, #3C1518 100%)',
        'gradient-hero':      'radial-gradient(ellipse 80% 50% at 50% -20%, #A4420028 0%, transparent 60%)',
        'gradient-ambition':  'linear-gradient(135deg, #D5893618, #D5893605)',
        'gradient-fear':      'linear-gradient(135deg, #A4420018, #A4420005)',
        'gradient-stoic':     'linear-gradient(135deg, #C8C97A18, #C8C97A05)',
        'gradient-rels':      'linear-gradient(135deg, #E8B84B18, #E8B84B05)',
        'gradient-creative':  'linear-gradient(135deg, #F2F3AE18, #F2F3AE05)',
        'gradient-mesh':
          'radial-gradient(at 15% 25%, #A4420008 0px, transparent 50%), ' +
          'radial-gradient(at 85% 75%, #D5893606 0px, transparent 50%), ' +
          'radial-gradient(at 50% 95%, #F2F3AE03 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-sm':     '0 0 14px #A4420022, 0 2px 8px #00000060',
        'glow-md':     '0 0 28px #A4420038, 0 4px 20px #00000070',
        'glow-lg':     '0 0 48px #A4420048, 0 8px 36px #00000080',
        'glow-amber':  '0 0 18px #D5893630, 0 2px 8px #00000060',
        'card':        '0 2px 12px #00000060, 0 0 0 1px #7D2D20',
        'card-hover':  '0 6px 24px #00000070, 0 0 0 1px #A44200, 0 0 18px #A4420018',
        'toast':       '0 8px 32px #00000080, 0 0 0 1px #7D2D20',
      },
      animation: {
        'fade-in':    'fadeIn 0.35s ease-out both',
        'slide-up':   'slideUp 0.38s cubic-bezier(.16,1,.3,1) both',
        'scale-in':   'scaleIn 0.28s cubic-bezier(.16,1,.3,1) both',
        'toast-in':   'toastIn 0.42s cubic-bezier(.16,1,.3,1) both',
        'toast-out':  'toastOut 0.26s ease-in both',
        'pulse-glow': 'pulseGlow 2.8s ease-in-out infinite',
        'float':      'float 4.5s ease-in-out infinite',
        'shimmer':    'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: '0', transform: 'scale(0.94)' }, to: { opacity: '1', transform: 'scale(1)' } },
        toastIn:   { from: { opacity: '0', transform: 'translateX(110%) scale(0.94)' }, to: { opacity: '1', transform: 'translateX(0) scale(1)' } },
        toastOut:  { from: { opacity: '1', transform: 'translateX(0) scale(1)' }, to: { opacity: '0', transform: 'translateX(112%) scale(0.96)' } },
        pulseGlow: { '0%,100%': { boxShadow: '0 0 8px #A4420028' }, '50%': { boxShadow: '0 0 22px #A4420055' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-7px)' } },
        shimmer:   { from: { backgroundPosition: '-200% 0' }, to: { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}

export default config