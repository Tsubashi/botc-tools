/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        titleFont: ["RoleName", "sans-serif"],
      },
      backgroundImage: {
        'parchment-pattern': "url('/img/parchment.webp')",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

