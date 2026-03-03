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
          primary:   '#F7F4EF',
          secondary: '#F0EDE6',
          tertiary:  '#E8E3D8',
          card:      '#FFFFFF',
          hover:     '#EAE5DC',
        },
        border: {
          subtle:  '#E8E3D8',
          default: '#DDD8CF',
          strong:  '#C2BDB3',
        },
        text: {
          primary:   '#1C1A17',
          secondary: '#5C574E',
          muted:     '#9C9589',
          accent:    '#C4622D',
        },
        accent: {
          warm:       '#C4622D',
          'warm-dim': '#A14E22',
          'warm-glow':'#C4622D16',
          cool:       '#4A6E8A',
          'cool-dim': '#3A5A74',
        },
        status: {
          active:    '#5E7A5E',
          paused:    '#C4622D',
          completed: '#4A6E8A',
          low:       '#4A6E8A',
          high:      '#8B2020',
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
