import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      fontSize: {
        '2.5xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      colors: {
        quest: {
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          volt: '#3b82f6',
        },
      },
      boxShadow: {
        pop: '0 4px 0 0 rgba(0,0,0,0.18)',
        'pop-sm': '0 2px 0 0 rgba(0,0,0,0.18)',
        glow: '0 10px 40px -10px rgba(16,185,129,0.55)',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 4s ease-in-out infinite',
        shine: 'shine 2.5s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
