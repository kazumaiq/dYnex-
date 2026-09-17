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
          900: '#06050a',
          850: '#0b0813',
          800: '#120d1f',
          700: '#1c152e',
        },
        signal: {
          red: '#E61924',
          'red-glow': '#FF2233',
          'red-dark': '#8A0A10',
        },
        cyber: {
          purple: '#8B5CF6',
          'purple-glow': '#A78BFA',
          'purple-deep': '#5B21B6',
          'purple-dark': '#2E1065',
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
      },
      boxShadow: {
        'cyber-purple-glow': '0 0 15px rgba(167, 139, 250, 0.4), 0 0 30px rgba(139, 92, 246, 0.2)',
        'signal-red-glow': '0 0 15px rgba(230, 25, 36, 0.4), 0 0 30px rgba(230, 25, 36, 0.2)',
        'neon-mix': '0 0 20px rgba(139, 92, 246, 0.35), 0 0 35px rgba(230, 25, 36, 0.25)',
      },
    },
  },
  plugins: [],
}
