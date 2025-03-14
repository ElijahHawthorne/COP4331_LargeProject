/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,jsx,ts,tsx}' // Adjust the path as needed
    // Add other paths to your template files here
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fcba03',
        secondary: '#FFA500', // Orange color
        accent: '#FF0000', // Red color
        // You can add more custom colors here
      },
    },
  },
  plugins: [],
};