import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        // Primary Navy — from logo
        navy: {
          50:  '#EEF0FA',
          100: '#D4D9F1',
          200: '#A9B2E2',
          300: '#7E8CD4',
          400: '#5365C5',
          500: '#1E3A8A',
          600: '#1B2B6B',
          700: '#162357',
          800: '#101A42',
          900: '#0B122E',
          950: '#060917',
        },
        // Gold Accent — from logo
        gold: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // Medical support colors
        medical: {
          white: '#FFFFFF',
          gray:  '#F8FAFC',
          lightblue: '#EFF6FF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#0F172A',
          muted: '#64748B',
          border: '#E2E8F0',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'card':    '0 2px 16px 0 rgba(27,43,107,0.08)',
        'card-md': '0 4px 24px 0 rgba(27,43,107,0.12)',
        'card-lg': '0 8px 40px 0 rgba(27,43,107,0.16)',
        'gold':    '0 4px 20px 0 rgba(245,158,11,0.25)',
        'cta':     '0 8px 32px 0 rgba(27,43,107,0.3)',
      },
      backgroundImage: {
        // Primary gradient — navy to blue
        'gradient-primary': 'linear-gradient(135deg, #0B122E 0%, #1B2B6B 50%, #1E3A8A 100%)',
        // Hero gradient overlay
        'gradient-hero': 'linear-gradient(135deg, rgba(11,18,46,0.92) 0%, rgba(27,43,107,0.80) 100%)',
        // Card subtle gradient
        'gradient-card': 'linear-gradient(135deg, #FFFFFF 0%, #EFF6FF 100%)',
        // Gold gradient
        'gradient-gold': 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        // Section background
        'gradient-section': 'linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      screens: {
        'xs': '390px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1440px',
      },
      spacing: {
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
      },
    },
  },
  plugins: [],
}

export default config
