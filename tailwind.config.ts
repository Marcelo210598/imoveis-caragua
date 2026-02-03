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
        primary: {
          50: '#e6f7ff',
          100: '#b3e0ff',
          200: '#80c9ff',
          300: '#4db3ff',
          400: '#1a9cff',
          500: '#0088cc',
          600: '#006699',
          700: '#004d73',
          800: '#00334d',
          900: '#001a26',
        },
        deal: {
          high: '#10b981',
          medium: '#f59e0b',
          low: '#6b7280',
        },
        sand: {
          50: '#fefcf3',
          100: '#fdf6e3',
          200: '#f5e6c8',
          300: '#e8d5a8',
        },
      },
    },
  },
  plugins: [],
}
export default config
