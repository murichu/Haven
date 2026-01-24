/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4B5E43", // Dark Green from new icon/theme in screenshot
        secondary: "#1F2937",
        accent: "#E8F5E9", // Lighter green for backgrounds
        background: "#F2F1EF", // Warm beige/gray background
        card: "#FFFFFF",
        "card-hover": "#FAFAFA",
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
      },
      borderRadius: {
        '3xl': '1.5rem', // For that super rounded look
        '4xl': '2rem',
      },
      fontFamily: {
        plaster: ['"Plaster"', "cursive"],
        inter: ['"Inter"', "sans-serif"],
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
