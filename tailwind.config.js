/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF9F6', // Ivory / Warm white
        surface: '#FFFFFF',
        'surface-subtle': '#F5F4F0',
        charcoal: {
          900: '#18181B',
          800: '#27272A',
          700: '#3F3F46',
          600: '#52525B',
          500: '#71717A',
          400: '#A1A1AA',
        },
        amber: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        sage: {
          50: '#F4F7F5',
          100: '#E3EBE6',
          500: '#2E7D32',
          600: '#1B5E20',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'soft-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'soft': '0 2px 8px -2px rgba(24, 24, 27, 0.05), 0 1px 4px -1px rgba(24, 24, 27, 0.03)',
        'soft-md': '0 4px 16px -4px rgba(24, 24, 27, 0.07), 0 2px 6px -2px rgba(24, 24, 27, 0.04)',
        'soft-lg': '0 10px 25px -5px rgba(24, 24, 27, 0.08), 0 8px 10px -6px rgba(24, 24, 27, 0.03)',
      }
    },
  },
  plugins: [],
}
