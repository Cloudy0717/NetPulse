/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: '#0F0E11',
          surface: '#1A181F',
          border: '#2C2936',
        },
        accent: {
          DEFAULT: '#F59E0B',
          secondary: '#A78BFA',
        },
        text: {
          primary: '#E4E0EC',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
