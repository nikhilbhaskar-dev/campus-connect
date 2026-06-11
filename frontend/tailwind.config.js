/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#10231d',
        paper: '#f4f3ee',
        line: '#1f4d3e',
        'line-soft': '#dde6e1',
        amber: '#f4a23a',
        'amber-soft': '#fdecd2',
        grey: '#7c8b85',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'card': '0 8px 24px -12px rgba(16,35,29,0.15)',
        'card-hover': '0 16px 32px -10px rgba(16,35,29,0.25)', // Punchier shadow
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        drawPath: {
          '0%': { strokeDasharray: '1 10', strokeDashoffset: '100' },
          '100%': { strokeDasharray: '1 10', strokeDashoffset: '0' },
        }
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in-up-delayed': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards',
        'fade-in-up-slow': 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards',
        'draw-path': 'drawPath 2s linear infinite reverse', // Animates the map dots!
      }
    },
  },
  plugins: [],
}