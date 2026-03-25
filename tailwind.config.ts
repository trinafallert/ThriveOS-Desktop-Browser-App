import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // ThriveOS brand colors
        thrive: {
          purple: '#7C3AED',
          'purple-light': '#EDE9FE',
          'purple-soft': '#F5F3FF',
          blue: '#3B82F6',
          'blue-light': '#DBEAFE',
          'blue-soft': '#EFF6FF',
          pink: '#EC4899',
          'pink-light': '#FCE7F3',
          'pink-soft': '#FDF2F8',
          teal: '#14B8A6',
          'teal-light': '#CCFBF1',
          gold: '#F59E0B',
          'gold-light': '#FEF3C7',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.6)' },
        },
      },
      backgroundImage: {
        'gradient-thrive': 'linear-gradient(135deg, #F5F3FF 0%, #EFF6FF 50%, #FDF2F8 100%)',
        'gradient-hero': 'linear-gradient(135deg, #EDE9FE 0%, #DBEAFE 50%, #FCE7F3 100%)',
        'gradient-card': 'linear-gradient(145deg, rgba(255,255,255,0.9) 0%, rgba(245,243,255,0.6) 100%)',
        'gradient-purple': 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)',
        'gradient-glow': 'radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'thrive': '0 4px 24px rgba(124, 58, 237, 0.12)',
        'thrive-lg': '0 8px 40px rgba(124, 58, 237, 0.18)',
        'card': '0 2px 16px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0,0,0,0.04)',
        'card-hover': '0 8px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.04)',
        'glow-purple': '0 0 30px rgba(124, 58, 237, 0.25)',
        'glow-blue': '0 0 30px rgba(59, 130, 246, 0.2)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.2)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
