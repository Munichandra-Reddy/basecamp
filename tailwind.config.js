/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        atlas: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          900: '#102a43',
        }
      }
    },
  },
  plugins: [],
}
