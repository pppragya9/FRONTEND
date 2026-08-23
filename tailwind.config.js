/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          bg: '#0a0f1a',
          dark: '#050811',
          card: '#101929',
          border: 'rgba(0, 212, 255, 0.2)',
          accent: '#00d4ff',
          warning: '#ffb020',
          danger: '#ff3b3b',
          success: '#00e676',
          muted: '#8493a8',
          light: '#e2e8f0'
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        'cyan-glow': '0 0 15px rgba(0, 212, 255, 0.25)',
        'cyan-glow-lg': '0 0 25px rgba(0, 212, 255, 0.4)',
        'danger-glow': '0 0 20px rgba(255, 59, 59, 0.4)',
        'warning-glow': '0 0 20px rgba(255, 176, 32, 0.4)',
        'success-glow': '0 0 20px rgba(0, 230, 118, 0.4)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radar 4s linear infinite',
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
