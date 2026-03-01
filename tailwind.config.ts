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
          primary: '#0a0a0f',
          secondary: '#111118',
          tertiary: '#1a1a24',
          card: '#13131c',
          hover: '#1e1e2a',
        },
        border: {
          subtle: '#1f1f2e',
          default: '#2a2a3d',
          strong: '#3d3d5c',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#9090a8',
          muted: '#5a5a72',
          accent: '#f0a050',
        },
        accent: {
          warm: '#f0a050',
          'warm-dim': '#c07830',
          'warm-glow': '#f0a05022',
          cool: '#6060c8',
          'cool-dim': '#4040a0',
        },
        status: {
          active: '#50c878',
          paused: '#f0a050',
          completed: '#6060c8',
          low: '#60c8c8',
          high: '#f05050',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
    },
  },
  plugins: [],
}
export default config
