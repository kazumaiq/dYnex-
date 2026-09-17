/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          950: '#020204',
          900: '#050507',
          850: '#08090C',
          800: '#111216',
          700: '#1A1B20',
        },
        signal: {
          red: '#E61924',
          'red-glow': '#FF2233',
          'red-dark': '#8A0A10',
        },
        technical: {
          muted: '#77777D',
          silver: '#D8D8D5',
          light: '#F2F2EE',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'Consolas', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif']
      },
      letterSpacing: {
        'widest-tech': '0.25em',
        'ultra-wide': '0.35em',
      }
    },
  },
  plugins: [],
}
