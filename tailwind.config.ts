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
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        'ios-blue': '#007AFF',
        'ios-blue-dark': '#0051D5',
        'ios-gray': '#F5F5F7',
        'ios-gray-dark': '#1D1D1F',
        'ios-gray-light': '#86868B',
        // キャバクラテーマカラー
        'cabaret-dark': '#1A1A1A',
        'cabaret-dark-secondary': '#2D2D2D',
        'cabaret-dark-card': '#2A2A2A',
        'cabaret-dark-section': '#3A3A3A',
        'gold': '#FFD700',
        'gold-bright': '#F5C842',
        'gold-dark': '#D4AF37',
        'rose-gold': '#E8B4B8',
        'rose-gold-dark': '#D4A5A5',
        'cabaret-pink': '#FF69B4',
        'cabaret-text-light': '#F5F5F5',
        'cabaret-text-secondary': '#CCCCCC',
      },
      borderRadius: {
        'ios': '16px',
        'ios-sm': '12px',
      },
      boxShadow: {
        'ios': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'ios-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
        'gold-glow': '0 0 20px rgba(255, 215, 0, 0.3)',
        'gold-glow-lg': '0 0 30px rgba(255, 215, 0, 0.4)',
        'pink-glow': '0 0 15px rgba(255, 105, 180, 0.3)',
      },
      transitionDuration: {
        'ios': '200ms',
      },
      transitionTimingFunction: {
        'ios': 'ease-in-out',
      },
    },
  },
  plugins: [],
}
export default config
