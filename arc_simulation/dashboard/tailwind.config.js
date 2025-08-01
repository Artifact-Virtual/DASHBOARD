/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark trading theme
        'dark': {
          900: '#0a0b0f',
          800: '#131620',
          700: '#1c1f2e',
          600: '#2a2d3e',
          500: '#363a4f',
          400: '#4a4f6a'
        },
        // Accent colors for trading UI
        'accent': {
          green: '#00d4aa',
          red: '#ff4757',
          blue: '#3742fa',
          purple: '#7c4dff',
          orange: '#ff6348',
          yellow: '#feca57'
        },
        // Chart colors
        'chart': {
          primary: '#00d4aa',
          secondary: '#3742fa',
          danger: '#ff4757',
          warning: '#feca57',
          info: '#74b9ff'
        }
      },
      fontFamily: {
        'mono': ['JetBrains Mono', 'Fira Code', 'Monaco', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px #00d4aa, 0 0 10px #00d4aa, 0 0 15px #00d4aa' },
          '100%': { boxShadow: '0 0 10px #00d4aa, 0 0 20px #00d4aa, 0 0 30px #00d4aa' }
        }
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px'
      }
    },
  },
  plugins: [],
}
